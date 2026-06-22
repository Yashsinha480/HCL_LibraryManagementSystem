let appPromise;
let dbPromise;

export default async function handler(req, res) {
  appPromise ||= import("../Backend/app.js");

  const [{ default: app }, { connectDatabase }] = await Promise.all([
    appPromise,
    import("../Backend/config/db.js")
  ]);

  dbPromise ||= connectDatabase();
  await dbPromise;

  return app(req, res);
}