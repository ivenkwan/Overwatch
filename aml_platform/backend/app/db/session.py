import psycopg2
from psycopg2 import pool
from contextlib import contextmanager

# Configuration (to be moved to core/config.py)
DB_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "database": "aml_platform",
    "user": "aml_admin", 
    "password": "secure_password_123"
}

# Dedicated Pools as suggested by the Skeptic
relational_pool = psycopg2.pool.SimpleConnectionPool(1, 10, **DB_CONFIG)
graph_pool = psycopg2.pool.SimpleConnectionPool(1, 5, **DB_CONFIG)

@contextmanager
def get_relational_connection():
    conn = relational_pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        relational_pool.putconn(conn)

@contextmanager
def get_graph_connection():
    conn = graph_pool.getconn()
    try:
        # Load Apache AGE context
        with conn.cursor() as cur:
            cur.execute("LOAD 'age';")
            cur.execute("SET search_path = ag_catalog, public;")
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        graph_pool.putconn(conn)
