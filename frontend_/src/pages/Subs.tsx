const SubsPage = ({ user } : SubscriptionPage)  =>{

    const subscriptions = user.subscriptions;
    
    return(
        <div>
            <h2>Welcome {user.username}</h2>
            <h2>Here you can manage your subscriptions</h2>
        </div>
    );
}

export default SubsPage;