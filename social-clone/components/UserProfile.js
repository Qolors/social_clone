

export default function UserProfile({ user }) {
    return( 
        <div className="flex flex-col gap-y-2 mb-12 rounded-lg shadow-lg justify-center place-items-center p-4 container w-3/4 h-3/4 mx-auto bg-slate-50">
            <img src={user.photoURL} className="rounded-full w-1/4 h-1/4" />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    )
}