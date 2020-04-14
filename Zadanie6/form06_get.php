<?php session_start(); ?>
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    </head>
    <body>
        <?php
            if($_SESSION["result"] == 1) {
                echo "<h3>Dodano pomyślnie pracownika!</h3>";
                $_SESSION["result"] = 10;
            }
        ?>

        <h1>Lista wszystkich pracowników:</h1>

        <?php
            $link = mysqli_connect("localhost", "scott", "tiger", "instytut");

            if (!$link) {
                printf("Connect failed: %s\n", mysqli_connect_error());
                exit();
            }

            $sql = "SELECT * FROM pracownicy";
            $result = $link->query($sql);
            foreach ($result as $v) {
                echo $v["ID_PRAC"]." ".$v["NAZWISKO"]."<br/>";
            }

            $result->free();
            $link->close();
        ?>
        <br><a href="form06_post.php">Wróc do formularza dodania nowego pracownika</a>
    </body>
</html>
