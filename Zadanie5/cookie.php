<?php session_start(); ?>

<!DOCTYPE html>

<html>
    <head>
        <title>PHP</title>
        <meta charset='UTF-8' />
    </head>
    <body>

        <?php
            require_once("funkcje.php");

            IF($_GET["utworzCookie"]) {
                setcookie("moje", "wysoka", time() + $_GET["czas"] , "/");
                echo "Utworzono cookie<br>";
            }
        ?>

        <a href="index.php">Powrót do panelu logowania</a>
    </body>
</html>
