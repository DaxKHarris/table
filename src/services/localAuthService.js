export default async function localAuth() {
    try {
        const res = await fetch("/api/user/token", {
            method: "GET",
            credentials: "include"
        });
        if (res.status===400) console.log("Bad request")
        if (res.status===401) console.log("Unauthorized request")
        if (res.status===403) console.log("It tis forbidden my lord")
        if (res.status===500) console.log("Tis something wrong from within.")
        if (res.status===200) return true;
    // return null;
        
    } catch (err) {
        console.log("Error has occured: ", err)
    }
}