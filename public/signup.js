function userinfo(){
    let pass1 = document.querySelector(".pass1").value;
    let pass2 = document.querySelector(".pass2").value;
    if(pass1 === pass2 ){
        document.getElementById("createuser").submit();
    }else{
        alert("Please check the Password you entered");
    }
}