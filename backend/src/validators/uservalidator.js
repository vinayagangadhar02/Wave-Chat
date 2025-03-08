
import {z} from "zod"


const userSchema=z.object({
f_name:z.string().min(1,"First name required").max(10,"First name too long"),
l_name:z.string().min(1,"Last name required").max(10,"Last name too long"),
email:z.string().email("Invalid email"),
password:z.string().min(6,"Password must be at least 6 characters long").max(12,"Password must be atmost  12 characters long")
})


export default userSchema