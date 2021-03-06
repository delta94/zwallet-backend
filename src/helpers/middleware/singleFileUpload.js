const multer = require("multer");
const path = require("path");
const { reject } = require("underscore");
const responseForm = require("../form/responseForm");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/images");
	},
	filename: (req, file, cb) => {
		let nameFormat;
		try {
			nameFormat = `images-${Date.now()}-${req.body.username
				.replace(" ", "")
				.toLowerCase()}${path.extname(file.originalname)}`;
		} catch (err) {
		} finally {
			cb(null, nameFormat);
		}
	},
});

const limits = {
	fileSize: 3 * 1e6,
};

const fileFilter = (req, file, cb) => {
	const fileTypes = /jpg|jpeg|gif|png/;
	const extName = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	if (extName) {
		cb(null, true);
	} else {
		cb("Error: Images Only");
	}
};

const upload = multer({
	storage,
	limits,
	fileFilter,
});

const singleFileUpload = {
	profileImageUpload: (req, res, next) => {
		const profileImageUpload = upload.single("image");
		profileImageUpload(req, res, (err) => {
			if (err) {
				responseForm.error(res, err, 400);
			} else {
				try {
					req.body.image = `/images/${req.file.filename}`;
				} catch (err) {
					// console.error(err);
					// responseForm.error(res, { msg: "Server error" }, 400);
				} finally {
					next();
				}
			}
		});
	},
};

module.exports = singleFileUpload;
