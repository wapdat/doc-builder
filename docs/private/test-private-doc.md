# Test Private Document

This is a test document in the private directory. It should only be visible to authenticated users.

## Private Information

This content is protected and requires authentication to view.

### Test Features

- This document should not appear in navigation for unauthenticated users
- Direct access to this URL should redirect to login
- Authenticated users should see this in the navigation menu
- The auth button should show login/logout state appropriately

## Example Private Content

```
API_KEY=sk_test_1234567890
DATABASE_URL=postgres://user:pass@host:5432/db
SECRET_TOKEN=super-secret-value
```

This demonstrates the type of sensitive content that would be placed in the private directory.