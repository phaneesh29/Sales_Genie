import { UserModel } from './models/user.model.js';


export async function seedDatabase() {
    try {
        const existedAdmin = await UserModel.findOne({role:"admin"})
        if (existedAdmin) {
            console.log("Admin user already exists. Skipping creation.");
            return;
        }
        await UserModel.create({
            name: 'admin',
            email: 'admin@example.com',
            password: 'admin@123',
            role: 'admin',
        })
        console.log("Admin user created successfully.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
