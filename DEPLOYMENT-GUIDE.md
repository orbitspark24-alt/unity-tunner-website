# 🚀 How to Put Your Website Online — Step by Step

This guide takes you from the website files on your computer to a **live website
on the internet** that anyone can visit. No coding or technical experience needed —
just follow each step in order and click the buttons as described.

**Total time:** about 30–45 minutes.
**You will do everything in your web browser** (Chrome, Edge, or Safari). No software to install.

---

## 💰 What it will cost (read this first)

| Thing | Cost | Why |
|---|---|---|
| **Hosting** (Render) | about **$7 / month** (~₹600) | Keeps your site online 24/7 and *saves your bookings & orders* |
| **Web address** (e.g. `yourbusiness.in`) | about **$10–15 / year** (~₹900) | Optional, but looks professional. You can add it later |

> ⚠️ **Important:** Do not pick Render's *free* plan. On the free plan your
> customer bookings and orders get **erased** every day. The paid plan keeps
> them safe. This guide uses the paid plan.

You'll also create **two free accounts** (GitHub and Render). The accounts are
free — you only pay for the hosting once you turn the site on.

---

## 📋 Before you start

Make sure you have:
- ✅ The website folder (unzipped from `unity-performance.zip`). You should see
  a folder called **`unity-performance`** with files like `package.json`,
  `README.md`, and folders named `src`, `public`, `data` inside it.
- ✅ An email address you can access.
- ✅ A debit/credit card (for the hosting subscription — only charged after you turn it on).

**To unzip:** right-click `unity-performance.zip` → **Extract All** → **Extract**.

---

# PART 1 — Put the website files online (GitHub)

GitHub is a free website that stores your code so the hosting service can read it.
Think of it as a locker for your website files.

### Step 1.1 — Create a free GitHub account
1. Go to **https://github.com/signup**
2. Enter your email, create a password and a username (e.g. `unityperformance`).
3. Verify your email when GitHub sends you a code.

### Step 1.2 — Create a new project ("repository")
1. After logging in, click the **`+`** icon in the top-right corner → **New repository**.
2. **Repository name:** type `unity-performance`
3. Leave everything else as default. Under "Public/Private" you may choose **Private**.
4. Click the green **Create repository** button.

### Step 1.3 — Upload the website files
1. On the next page you'll see a link that says **"uploading an existing file"** —
   click it. (Or click **Add file → Upload files**.)
2. Open the **`unity-performance`** folder on your computer.
3. Select **everything inside it** (click one file, then press `Ctrl+A` to select all)
   and **drag it all** into the upload box in your browser.
4. Wait for the files to finish uploading (you'll see them listed).
   - 💡 If GitHub says "too many files," just upload the folders one at a time:
     drag the `src` folder, wait, then `public`, then `data`, then the loose files.
5. Scroll down and click the green **Commit changes** button.

✅ Your website files are now on GitHub. Keep this browser tab open.

---

# PART 2 — Turn the website on (Render)

Render is the service that actually runs your website so people can visit it.

### Step 2.1 — Create a Render account (using GitHub — one click)
1. Go to **https://render.com** and click **Get Started**.
2. Choose **Sign in with GitHub** (the fastest way).
3. When GitHub asks "Authorize Render," click the green **Authorize** button.

### Step 2.2 — Deploy your website
1. In the Render dashboard, click the **New +** button (top right) → **Blueprint**.
2. Render shows your GitHub projects. Find **`unity-performance`** and click **Connect**.
   - If you don't see it, click **"Configure account"** and allow Render to access the repo.
3. Render will read the setup file included in your project and show a service
   named **unity-performance**. 
4. It will ask you to fill in **`ADMIN_PASSWORD`** — this is the password you'll
   use to log in and manage your website. **Type a strong password and write it down somewhere safe.**
5. Click **Apply** (or **Create**).

### Step 2.3 — Wait for it to build
- Render now sets everything up. This takes about **3–5 minutes**.
- You'll see logs scrolling. When you see **"Live"** with a green dot, it's ready. 🎉

### Step 2.4 — Visit your live website!
- At the top of the page, Render shows your website address — something like
  **`https://unity-performance.onrender.com`**.
- Click it. **Your website is now live on the internet!** Share that link with anyone.

---

# PART 3 — Log in to manage your website

Your site has a built-in control panel where you can change text, prices, photos,
services, and see your bookings and orders — **no coding needed**.

1. Go to your website address and add **`/admin`** at the end, e.g.
   `https://unity-performance.onrender.com/admin`
2. Enter the **password you set in Step 2.2**.
3. You're in! From the sidebar you can edit:
   - **Site Content** — homepage text, statistics, contact details, testimonials
   - **Services** — your tuning services and prices
   - **Builds** — the car gallery (add real car photos here)
   - **Products** — the shop items
   - **Bookings / Orders / Leads** — customer requests come in here

> 💡 Any change you make in the admin panel appears on the live website
> **instantly** — you do NOT need to re-deploy or touch any code.

---

# PART 4 — Use your own web address (optional)

Instead of `unity-performance.onrender.com`, you can use `www.yourbusiness.in`.

### Step 4.1 — Buy a domain name
1. Go to a domain seller like **https://www.godaddy.com**, **https://www.hostinger.in**,
   or **https://www.namecheap.com**.
2. Search for the name you want (e.g. `unityperformance.in`) and buy it (~₹900/year).

### Step 4.2 — Connect it to Render
1. In Render, open your **unity-performance** service → **Settings** → scroll to **Custom Domains**.
2. Click **Add Custom Domain**, type your domain (e.g. `www.yourbusiness.in`), click **Save**.
3. Render shows you a small piece of text to copy (called a **CNAME**).
4. Log in to where you bought the domain, find **DNS settings**, and add the record
   Render told you to add. (Each seller has a "DNS" or "Manage DNS" page — paste the
   value Render gave you.)
5. Wait 10–60 minutes. Render will show a green tick when your domain is connected.

> Not comfortable with this part? It's the one slightly fiddly step. You can ask
> whoever you bought the website from, or your domain seller's support chat — they
> do this all day.

---

# ❓ Troubleshooting

**The site says "Application failed to respond" or won't load right after deploying.**
Wait 5 minutes — it's probably still building. Refresh the page.

**I forgot my admin password.**
In Render: open your service → **Environment** → edit **`ADMIN_PASSWORD`** → save.
The site restarts with the new password in ~2 minutes.

**My changes/photos disappeared.**
This only happens on the *free* plan. Make sure you're on the **paid (Starter) plan**
with a disk — that's what this guide's setup uses, so you should be safe.

**The site is slow the first time I open it after a while.**
On lower plans the site "sleeps" when unused and takes ~30 seconds to wake up.
Upgrade the plan in Render if you want it always instant.

---

# ⚠️ Two things to set up before taking real customers

1. **Online payments are not connected yet.** Right now the checkout and booking
   deposit record the order but **do not charge money**. To accept real online
   payments, a developer needs to add your **Razorpay** (or Stripe) account keys.
   Until then, collect payment in person or over the phone.

2. **Booking/order email alerts** are not connected. New bookings and orders **do**
   appear in your admin panel (check it regularly), but you won't get an automatic
   email/WhatsApp yet. A developer can connect this when you're ready.

---

# 📞 Quick reference

| What | Where |
|---|---|
| Your live website | the `https://...onrender.com` link (or your own domain) |
| Manage everything | add `/admin` to your website address |
| Hosting dashboard | https://dashboard.render.com |
| Your code storage | https://github.com |

**You're live! 🏁** Log in to `/admin` and start adding your real services, prices, and car photos.
