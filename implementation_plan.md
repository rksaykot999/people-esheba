# Dual-Language Bulk Import & Dedicated Backup System

This plan addresses your two requests: updating the Bulk Import system to support dual languages (English and Bangla) and fixing/separating the Backup & Restore system.

## Proposed Changes

### 1. Database Schema Updates
To support dual languages from the imported data, we must add Bengali (`_bn`) columns to all relevant tables. 
- **`doctors`**: Add `name_bn`, `specialty_bn`, `area_bn`
- **`pharmacies`**: Add `name_bn`, `area_bn`
- **`notices`**: Add `title_bn`, `description_bn`
- **`education_institutions`**: Add `name_bn`, `address_bn`, `description_bn`
- **`scholarships`**: Add `title_bn`, `provider_bn`, `description_bn`
- **`jobs`**: Add `title_bn`, `company_bn`, `description_bn`
- **`emergency_services`**: Add `name_bn`, `address_bn`

### 2. Importer Updates
#### [MODIFY] `client/src/components/admin/BulkImportModal.jsx`
- Update all template columns (e.g., add `name_bn`, `specialty_bn`) to the CSV/Excel templates.
- Update the manual text so admins know how to populate English and Bengali columns.

### 3. Frontend UI Updates
#### [MODIFY] Page Components (`Doctors.jsx`, `School.jsx`, `Emergency.jsx`, etc.)
- Update the display logic to use the `_bn` columns when the language toggle is set to Bengali. E.g., `isBn && item.name_bn ? item.name_bn : item.name`.

### 4. Perfecting Backup & Restore
Since your live database is hosted on Aiven (which strictly requires SSL connections), the native OS `mysqldump` command is failing. Also, the current backup intentionally skips the `uploads/` folder and `.env` file to save space, but a "perfect" backup should probably include everything.
#### [MODIFY] `server/package.json`
- Install `mysqldump` NPM package to take reliable database backups using Node (this works perfectly with Aiven's SSL requirement).
#### [MODIFY] `server/src/controllers/backup.controller.js`
- Rewrite the zip creation logic to include the `uploads/` directory, `.env` files, the database `.sql` dump, and the `client/dist` (frontend build). 
- Provide an endpoint to safely restore from this perfect zip.

### 5. Moving Backup to the Sidebar
#### [NEW] `client/src/pages/admin/AdminBackup.jsx`
- Create a dedicated, full-page UI for Backup & Restore with progress bars and history.
#### [MODIFY] `client/src/components/layout/AdminLayout.jsx`
- Add "Backup & Restore" as a top-level sidebar item.
#### [MODIFY] `client/src/pages/admin/AdminSettings.jsx`
- Remove the Backup & Restore tab from the general settings.

---

> [!IMPORTANT]
> **Schema Changes:** Are you okay with adding these `_bn` columns to the database? This is the most reliable way to let the frontend toggle seamlessly between languages for data rows.

> [!WARNING]
> **Backup File Size:** Including the `uploads/` directory in the backup `.zip` can make the file significantly larger over time. I will compress it as much as possible, but please keep this in mind.

Please review and approve this plan, and I will execute the changes!
