<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

My Learning Project in Nest.JS, Creating Simple Contact API

## Project Checklist

### User Endpoint

- [x] Register User
- [x] Send Email to Verify User
- [x] Verify User
- [x] Send Welcome Email after User Verified.
- [x] Login User
- [x] Get Logged In User
- [x] Update User Data
- [x] Logout User

### Contact Endpoint

- [x] Get All Contact & Search Contact
- [x] Create Contact
- [x] Get Contact
- [x] Update Contact
- [x] Update Contact Image
- [x] Delete Contact

### Address Endpoint

- [x] Get All Addresses in the Contact
- [x] Create Addresses of Contact
- [x] Get Address
- [x] Update Address
- [x] Delete Address

### Todo

- [ ] Make Endpoint for forgot password
- [x] Setup Swagger UI
- [x] Create setup for multer to upload in cloud bucket like Cloudflare R2/AWS S3/GCP Cloud Storage

## Project Endpoint

You can see at **doc** folder or import the postman collection.
or you can go to swagger api docs:

[SWAGGER API DOCS](https://localhost:3000/api)

## Project setup

```bash
npm install
npx prisma init
```

## Setup your .env

```bash
DATABASE_URL="mysql://root:@localhost:3306/nest_contacts?schema=public"

# MAIL CONFIG
MAIL_HOST="yourwebserver.domain.com"
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=yourmail@domain.com
MAIL_PASS=YourPassword

# HASHIDS CONFIG
HASHIDS_SALT=YOURSALT

# STORAGE MODE
STORAGE=local # (local, r2, s3, gcp) : local (local server), r2 (cloudflare), s3 (aws), gcp(google cloud)

## LOCAL UPLOADS
UPLOAD_DIR=uploads # Directory for local uploads

## CLOUDFLARE R2 STORAGE
CLOUDFLARE_R2_ENDPOINT=https://<your-account-id>.r2.cloudflarestorage.com
CLOUDFLARE_R2_DEV_URL=<your-r2-dev-subdomain-public-url>
CLOUDFLARE_R2_ACCESS_KEY=<your-access-key-id>
CLOUDFLARE_R2_SECRET_KEY=<your-secret-access-key>
CLOUDFLARE_R2_BUCKET=<your-bucket-name>

## AWS S3 STORAGE
AWS_REGION=us-west-2  # Replace with your actual region
AWS_ACCESS_KEY_ID=your-access-key-id  # Replace with your actual access key ID
AWS_SECRET_ACCESS_KEY=your-secret-access-key  # Replace with your actual secret access key
AWS_BUCKET_NAME=your-s3-bucket-name  # Replace with your actual bucket name

GCP_PROJECT_ID=your-gcp-project-id
GCP_KEY_FILE=path/to/your/service-account-key.json
GCP_BUCKET_NAME=your-gcs-bucket-name
```

## Run Prisma

```bash
npx prisma migrate dev
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

Make sure you change the email for testing in **should be return 201 when request is valid and success register** at **user.spec.ts**

```bash
# unit tests (empty record in db)
$ npm run test

# have record in db (run partial)
$ npm run test -- user.spec.ts
$ npm run test -- contact.spec.ts
$ npm run test -- address.spec.ts
```

## Another way to Run

More simple shortcut to use in windows :D

```bash
run.bat dev|test|build|lint|prod
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
npm install -g mau
mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch (Nest.Js Author)

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
