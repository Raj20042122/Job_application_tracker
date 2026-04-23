exports.success = (res, data, msg = "OK", status = 200) =>
  res.status(status).json({ success: true, msg, data });

exports.error = (res, msg = "Error", status = 500) =>
  res.status(status).json({ success: false, msg });

