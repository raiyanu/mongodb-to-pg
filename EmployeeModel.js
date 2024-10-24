import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
	f_Id: {
		type: Number,
		required: true,
		// unique: true,
	},
	f_Image: {
		data: Buffer,
		contentType: String,
	},
	f_Image_meta: Object,
	f_Name: {
		type: String,
		required: true,
	},
	f_Email: {
		type: String,
		required: true,
		// unique: true,
	},
	f_Mobile: {
		type: String,
		required: true,
		// unique: true,
	},
	f_Designation: {
		type: String,
		required: true,
	},
	f_Gender: {
		type: String,
		required: true,
		enum: ["male", "female"],
	},
	f_Course: String,
	f_Address: {
		type: String,
		required: false,
	},
	f_Createdate: {
		type: Date,
		default: Date.now, // Automatically sets the creation date to the current time
	},
});

employeeSchema.pre("validate", async function (next) {
	if (!this.f_Id) {
		const latestBlog = await this.constructor.findOne(
			{},
			{},
			{ sort: { f_Id: -1 }, limit: 1 },
		);
		this.f_Id = latestBlog ? latestBlog.f_Id + 1 : 1;
	}
	next();
});

// Create the model
const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
