// ── routes/index.js — Central router ─────────────────────────
const express  = require('express');
const router   = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

// ── Auth ──────────────────────────────────────────────────────
const auth = require('../controllers/auth.controller');
router.post('/auth/register', auth.register);
router.post('/auth/login',    auth.login);
router.get( '/auth/me',       protect, auth.getMe);

// ── Users ─────────────────────────────────────────────────────
const user = require('../controllers/user.controller');
router.get( '/users/profile',              protect, user.getProfile);
router.put( '/users/profile',              protect, user.updateProfile);
router.delete('/users/profile',            protect, user.deleteProfile);
router.post('/users/avatar',               protect, require('../middleware/upload').uploadAvatar, user.uploadAvatar);
router.put( '/users/password',             protect, user.changePassword);
router.get( '/users/notifications',        protect, user.getNotifications);
router.put( '/users/notifications/read',   protect, user.markNotificationsRead);
router.get( '/users/bookmarks',            protect, user.getBookmarks);
router.post('/users/bookmarks',            protect, user.toggleBookmark);

// ── Emergency ─────────────────────────────────────────────────
const emg = require('../controllers/emergency.controller');
router.get( '/sos',          emg.getSOS);
router.get( '/emergency',    emg.getAll);
router.get( '/emergency/:id',emg.getOne);
router.post('/emergency',    protect, emg.create);
router.put( '/emergency/:id',protect, emg.update);
router.delete('/emergency/:id', protect, adminOnly, emg.remove);

// ── Blood Donors ──────────────────────────────────────────────
const blood = require('../controllers/blood.controller');
router.get( '/blood-donors',              blood.getAll);
router.post('/blood-donors',              protect, blood.register);
router.get( '/blood-donors/me',           protect, blood.getMyDonor);
router.put( '/blood-donors/availability', protect, blood.toggleAvailability);
router.put( '/blood-donors/me',           protect, blood.update);

// ── Donations ─────────────────────────────────────────────────
const don = require('../controllers/donation.controller');
router.get( '/donations',      don.getAll);
router.get( '/donations/mine', protect, don.getMyDonations);
router.get( '/donations/:id',  don.getOne);
router.post('/donations',      protect, require('../middleware/upload').uploadDonation, don.create);
router.post('/donations/:id/donate', protect, don.donate);

// ── Jobs ──────────────────────────────────────────────────────
const job = require('../controllers/job.controller');
router.get( '/jobs',                      job.getAll);
router.get( '/jobs/my-applications',      protect, job.getMyApplications);
router.post('/jobs',                      protect, job.create);
router.get( '/jobs/:id',                  job.getOne);
router.put( '/jobs/:id',                  protect, job.update);
router.delete('/jobs/:id',               protect, job.remove);
router.post('/jobs/:id/apply',           protect, require('../middleware/upload').uploadResume, job.apply);
router.get( '/jobs/:id/applications',    protect, job.getApplications);
router.put( '/jobs/applications/:appId', protect, job.updateApplication);

// ── Volunteers ────────────────────────────────────────────────
const vol = require('../controllers/volunteer.controller');
router.get( '/volunteers',    vol.getAll);
router.post('/volunteers',    protect, vol.register);
router.get( '/volunteers/me', protect, vol.getMyVolunteer);
router.put( '/volunteers/me', protect, vol.updateVolunteer);
router.delete('/volunteers/me', protect, vol.deactivate);

// ── Admin ─────────────────────────────────────────────────────
const adm = require('../controllers/admin.controller');
const A   = [protect, adminOnly];

router.get( '/admin/dashboard', ...A, adm.getDashboard);
router.get( '/admin/analytics', ...A, adm.getAnalytics);

router.get(   '/admin/users',         ...A, adm.getUsers);
router.put(   '/admin/users/:id/toggle', ...A, adm.toggleUser);
router.put(   '/admin/users/:id/role',   ...A, adm.changeRole);
router.delete('/admin/users/:id',     ...A, adm.deleteUser);

router.get(   '/admin/donations',         ...A, adm.getDonations);
router.put(   '/admin/donations/:id',     ...A, adm.updateDonationStatus);
router.delete('/admin/donations/:id',     ...A, adm.deleteDonation);

router.get(   '/admin/jobs',              ...A, adm.getAllJobs);
router.delete('/admin/jobs/:id',          ...A, adm.deleteJob);

router.get(   '/admin/blood-donors',      ...A, adm.getBloodDonors);
router.get(   '/admin/volunteers',        ...A, adm.getVolunteers);

router.get(   '/admin/emergency',         ...A, adm.getEmergencyServices);
router.post(  '/admin/emergency',         ...A, adm.createEmergencyService);
router.put(   '/admin/emergency/:id',     ...A, adm.updateEmergencyService);
router.delete('/admin/emergency/:id',     ...A, adm.deleteEmergencyService);

router.get(   '/admin/reports',           ...A, adm.getReports);
router.put(   '/admin/reports/:id/resolve',...A, adm.resolveReport);
router.post(  '/admin/announcements',     ...A, adm.createAnnouncement);

module.exports = router;
