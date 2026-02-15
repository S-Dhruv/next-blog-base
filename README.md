# Next-Blog Deployment Template

This is a starter template for deploying [Next-Blog](https://github.com/captadexp/next-blog), the enterprise-grade headless CMS for Next.js.

## 🚀 Deployment

Click the button below to deploy your own instance of Next-Blog to Vercel:


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FS-Dhruv%2Fdeploy-next-blog&env=MONGODB_URI,MONGODB_DB_NAME,SESSION_SECRET,ADMIN_EMAIL&envDescription=Configure%20your%20database%20and%20security%20settings&project-name=next-blog-starter&repository-name=next-blog-starter&install-command=bun%20install&build-command=bun%20run%20build)


## 📋 Environment Variables

When deploying, Vercel will ask for the following Environment Variables:

### Required for Production (MongoDB)
- `MONGODB_URI`: Your MongoDB connection string (e.g. from MongoDB Atlas)
- `MONGODB_DB_NAME`: The database name (default: nextblog)

### Security
- `SESSION_SECRET`: A random 32-character string for securing sessions.
- `ADMIN_EMAIL`: The email address for the initial admin user.

### Optional (S3 Storage)
If you want to store images in S3 (highly recommended for production):
- `S3_BUCKET`: Your S3 bucket name
- `S3_REGION`: Your S3 region (e.g., us-east-1)
- `S3_ACCESS_KEY`: Your AWS Access Key ID
- `S3_SECRET_KEY`: Your AWS Secret Access Key

## 🛠 Local Development

1.  Clone your repository (created by Vercel)
2.  Install dependencies: `npm install`
3.  Copy `.env.example` to `.env` and fill in your values
4.  Run the dev server: `npm run dev`
5.  Open `http://localhost:3000/api/next-blog/dashboard`
