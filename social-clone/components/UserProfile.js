

export default function UserProfile({ user }) {
    return( 
        <div className="container mx-auto">
            <img src={user.photoURL} className="w-15px h-15px float-left" />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    )
}