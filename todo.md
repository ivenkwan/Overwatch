# To-Do List
## Front-End
- [DONE] keep these temp data model localized to the frontend components for now, paving the way for the backend API integration later
- [DONE] Rebuild entire dashboard with proper structure instead of Single-page monolith
  - [DONE] Implement skeleton UI for dashboard instead of full-screen spinner
  - [DONE] the frontend must use the backend API
  - [DONE] Enable URL routing to support bookmark, deep-link, and use browser history
  - [] Implement .env for environment variable, 
- [] Implement production grade dashboard with proper structure and backend API integration
  - [DONE] AlertWorkbench
  - [] CaseManagement and workflow engine
  - [] STRPreparation
  - [] ScreeningModule
  - [DONE] GovernanceMIS and KPI summary
- [DONE] AlertWorkbench textareas implement "Not Null" validation and submission handlers (STR pending)
- [DONE] Alert lifecycle workflow frontend integration
- [DONE] To implement Graph exploration with entity and depth parameters based on color and thickness of line and shape
- [DONE] Implement error boundaries to prevent single component crash takes down entire app
- [] Implement frontend authentication with auth headers on API calls, session management, and protected routes

## Back-End
- [DONE] PII Masking (hiding sensitive data based on role) 
- [DONE] Production Hardening (Environment Variables/JWT secrets) 
- [] Graph Explorer Performance (Node clustering/pagination)
- [] Implement STR endpoint
- [DONE] daily refreshed KPI summary from ETL job according to defined KPIs in spec
- [DONE] Fix sync/async DB calls in auth.py, admin.py, reports.py
- [DONE] Implement alert lifecycle endpoints (assign, propose, approve, reject) 
- [DONE] Fix get_neighborhood() to use entity_id and depth parameters
- [DONE] Restrict CORS to specific origins
- [] Persist audit logs to database or tamper-evident log sink

## Fix Issues
- [DONE] Server scripts aml_platform/api/server.py
  - [DONE] Hardcoded credentials	`password="secure_password_123"` on line 24
  - [DONE] Mock RBAC Header check: `Authorization: Bearer compliance_analyst_token`
  - [DONE] Incomplete graph	Cypher query executed but results not parsed (line 89: `pass`)
  - [DONE] Superseded The modular backend in `backend/app/` replaces this


