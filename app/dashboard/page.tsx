import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";

async function getUserDetails() {
  try {
    await connectDB();
    const users = await User.find({}).lean();
    return users;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const userDetails = await getUserDetails();
return (
  <>
    {userDetails &&
      userDetails.map((user: any) => (
        <div key={user._id}>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      ))}

    <pre>{JSON.stringify(userDetails, null, 2)}</pre>
  </>
);
}
 