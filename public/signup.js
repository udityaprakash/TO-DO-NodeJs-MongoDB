function userinfo(){
    let pass1 = document.querySelector(".pass1").value;
    let pass2 = document.querySelector(".pass2").value;
    let username = document.querySelector(".usernaam").value;
    let num = document.querySelector(".num").value;
    if(pass1 === pass2){
        if(username.length>=8){
            if(num>=5000000000){
                    document.getElementById("createuser").submit();

                }else{
                    alert("Please check the Mobile number you entered");
                }
            } else{
                alert("Please check the username you entered");
            }
    }else{
        alert("Please check the Password you entered");
    }
}