import { connectDB } from "@/app/lib/mongodb"

export async function GET(req:Request) {
try{
    const db = await connectDB();
const userDetails = await db.model("User").find({});
if(userDetails){
    return new Response(JSON.stringify(userDetails), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
else{
    return new Response(JSON.stringify({ message: "User details not found" }), {
        status: 404,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
}
catch(error){
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
}

