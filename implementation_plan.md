# Approval System — Full Website

ব্যবহারকারীরা যেকোনো পোস্ট বা রিকোয়েস্ট করলে সেটি প্রথমে **pending** অবস্থায় থাকবে। Admin approve করলে তবেই সেটি ওয়েবসাইটে দেখা যাবে।

## বর্তমান অবস্থা (Current State)

বিশ্লেষণে দেখা গেছে:

| ফিচার | বর্তমান অবস্থা |
|---|---|
| **Donations** | ✅ আলরেডি `pending/approved` সিস্টেম আছে। Admin panel-ও ready। |
| **Jobs** | ❌ User post করলে সরাসরি `status='active'` হয়ে যায় — approve ছাড়া। |
| **Blood Donor** | ❌ Register করলেই সরাসরি দেখায় — কোনো approval নেই। |
| **Volunteers** | ❌ Register করলেই `is_active=1` হয়ে সরাসরি দেখায়। |
| **Emergency** | ⚠️ User create করতে পারে কিন্তু `is_verified=0` দিয়ে — অর্থাৎ কিছুটা controlled। তবে সরাসরি public-এ দেখা যায়। |

## প্রয়োজনীয় পরিবর্তন

### Backend — 3টি Controller পরিবর্তন

---

#### [MODIFY] [job.controller.js](file:///g:/People%20E%20Sheba/people-esheba/server/src/controllers/job.controller.js)
- `create()` এ `status` default করে `'pending'` করা হবে (এখন `'active'`)
- Public `getAll()` এ `WHERE j.status = 'active'` ইতিমধ্যে আছে — ঠিকই আছে

#### [MODIFY] [blood.controller.js](file:///g:/People%20E%20Sheba/people-esheba/server/src/controllers/blood.controller.js)
- `register()` এ `status='pending'` column যুক্ত করা হবে
- `getAll()` এ `WHERE b.status='approved'` condition যুক্ত করা হবে
- Admin এ approve/reject route যুক্ত

#### [MODIFY] [volunteer.controller.js](file:///g:/People%20E%20Sheba/people-esheba/server/src/controllers/volunteer.controller.js)
- `register()` এ `is_active=0` (pending) দিয়ে insert করা হবে (এখন default 1)
- `getAll()` এ `v.is_active = 1` ইতিমধ্যে আছে — ঠিকই আছে
- Admin এর `verifyVolunteer` কে approve হিসেবে use করা হবে

#### [MODIFY] [admin.controller.js](file:///g:/People%20E%20Sheba/people-esheba/server/src/controllers/admin.controller.js)
- Blood donor এর `approve/reject` endpoint যুক্ত
- Job-এর pending count dashboard-এ যুক্ত
- একটি unified **pending approvals count** API যুক্ত

#### [MODIFY] [routes/index.js](file:///g:/People%20E%20Sheba/people-esheba/server/src/routes/index.js)
- Blood donor approve/reject route যুক্ত

---

### Database — 1টি পরিবর্তন

#### blood_donors table
- `status` column যুক্ত করতে হবে: `ENUM('pending','approved','rejected') DEFAULT 'pending'`
- এটি SQL migration script দিয়ে করা হবে

---

### Frontend — Admin Panel পরিবর্তন

#### [MODIFY] [AdminJobs.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/admin/AdminJobs.jsx)
- Status filter এ `pending` tab যুক্ত করা হবে (এখন শুধু সব jobs দেখায়)
- **Approve (✓) / Reject (✗)** বাটন যুক্ত করা হবে pending jobs-এর জন্য
- Pending jobs badge count দেখানো হবে

#### [MODIFY] [AdminBlood.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/admin/AdminBlood.jsx)
- Status filter যুক্ত: `pending / approved / rejected`
- **Approve / Reject** বাটন যুক্ত
- Pending count দেখানো হবে

#### [MODIFY] [AdminVolunteers.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/admin/AdminVolunteers.jsx)  
- Status filter যুক্ত: `pending / active / inactive`
- **Approve (is_active=1)** বাটন — (এই কাজটি বিদ্যমান `verifyVol` দিয়ে হবে, কিন্তু UI-তে "Approve" label দেওয়া হবে)
- Inactive volunteers-ও দেখা যাবে

#### [MODIFY] [AdminDashboard.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/admin/AdminDashboard.jsx)
- Dashboard stats-এ `pending_jobs` count যুক্ত করা হবে

---

### Frontend — User-Facing পরিবর্তন

#### [MODIFY] [JobNew.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/JobNew.jsx)
- Job submit করার পর success message: **"আপনার job post admin-এর অনুমোদনের জন্য পাঠানো হয়েছে"**

#### [MODIFY] [Volunteers.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/Volunteers.jsx)
- Register success message: **"আপনার volunteer registration admin review করবে"**

#### [MODIFY] [Blood.jsx](file:///g:/People%20E%20Sheba/people-esheba/client/src/pages/Blood.jsx)
- Register success message: **"আপনার blood donor registration admin review করবে"**

---

## Verification Plan

1. User দিয়ে Job post করব → Admin panel এ "pending" দেখাবে → Approve করলে public site-এ দেখাবে
2. User দিয়ে Blood donor register করব → Admin এ pending দেখাবে → Approve করলে blood page-এ দেখাবে
3. User দিয়ে Volunteer register করব → Admin এ pending দেখাবে → Approve করলে volunteers page-এ দেখাবে
4. Donation approval আগে থেকেই কাজ করছে → verify করব

## Open Questions

> [!NOTE]
> **Emergency request:** User যখন emergency service add করে, সেটাও কি approval-এ রাখা দরকার? নাকি আলাদা রাখব?
> বর্তমানে user-created emergency service সরাসরি database-এ যায় কিন্তু `is_verified=0` থাকে।
