import mongoose from "mongoose";
import pkg from "pg";
const { Client } = pkg;
import Employee from "./EmployeeModel.js";

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

const client = new Client({
	host: process.env.HOST,
	port: process.env.PORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
});

client
	.connect()
	.then(() => console.log("Connected to PostgreSQL"))
	.catch((err) => console.error("Connection error", err.stack));

const GetEmployees = async () => {
	Employee.find({})
		.select("-f_Image")
		.then((Employees) => {
			//		Employees.forEach((Employee) => {
			//			console.log(Employee);
			//    });
			return Employees;
		});
};
const migrateEmployees = async () => {
	try {
		const employees = await Employee.find({}).select("-f_Image");

		for (const employee of employees) {
			const query = `
				INSERT INTO employees (
					f_Id, f_Name, f_Email, f_Mobile, f_Designation, 
					f_Gender, f_Course, f_Address, f_Createdate
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				ON CONFLICT (f_Id) DO NOTHING;
			`;

			const values = [
				employee.f_Id,
				employee.f_Name,
				employee.f_Email,
				employee.f_Mobile,
				employee.f_Designation,
				employee.f_Gender,
				employee.f_Course || null,
				employee.f_Address || null,
				employee.f_Createdate || new Date(),
			];

			await client.query(query, values);
		}

		console.log("Data migration complete");
	} catch (error) {
		console.error("Error during migration:", error);
	} finally {
		client.end();
	}
};

migrateEmployees();
