<?php
    $to = 'xxx@example.com';
    $name = $_POST["name"];
    $email= $_POST["email"];
    $message = $_POST["message"];
    
    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= "From: " . $email . "\r\n"; // Sender's E-mail
    // $headers .= "From: " . $name . "\r\n"; // Sender's E-mail
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    $message ='<table style="width:100%">
        <tr>
            <td>'.$name.'  '.$email.'</td>
        </tr>
        <tr><td>Name: '.$name.'</td></tr>
        <tr><td>Messege: '.$message.'</td></tr>       
    </table>';

    if (@mail($to, $email, $message, $headers))
    {
        echo 'The message has been sent.';
    }else{
        echo 'failed';
    }
    
?>
