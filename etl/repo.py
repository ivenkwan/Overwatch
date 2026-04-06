from dagster import Definitions, load_assets_from_modules

from assets import ledger_ingest, graph_projection

all_assets = load_assets_from_modules([ledger_ingest, graph_projection])

defs = Definitions(
    assets=all_assets,
)
