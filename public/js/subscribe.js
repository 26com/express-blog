function subscribe(id){

    const followIcon = document.getElementById(id);

    const user = {
        followerId: id
    };

    const json = JSON.stringify(user);

    if(!followIcon.classList.contains('follow')){

        followIcon.classList.add('follow');

        const request = new XMLHttpRequest();
        request.open("POST", "/users/subscribe");
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send(json);

    }else{

        followIcon.classList.remove('follow');

        const request = new XMLHttpRequest();
        request.open("POST", "/users/unsubscribe");
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        request.send(json);

    };


};