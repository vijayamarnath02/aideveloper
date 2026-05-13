import { verifyToken } from "@/app/lib/jwt";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { cookies } from "next/headers";

async function getUserDetails() {
  try {
    await connectDB();
    const token = (await cookies()).get("token");
    if (!token) {
      console.error("No token found in cookies");
      return null;
    }
    const userDetails1: any = verifyToken(token ? token.value : "");

    if (userDetails1 === null) {
      console.error("Invalid token");
      return null;
    }
    const users = await User.findOne({ email: userDetails1.email }).lean();
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
      {userDetails && (
        <div key={userDetails._id}>
          <h2>{userDetails.name}</h2>
          <p>Email: {userDetails.email}</p>
        </div>
      )}

      <pre>{JSON.stringify(userDetails, null, 2)}</pre>
    </>
  );
}
