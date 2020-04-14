<?php session_start(); ?>
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    </head>
    <body>
        <form action="form06_redirect.php" method="POST">
            id_prac <input type="text" name="id_prac">
            nazwisko <input type="text" name="nazwisko">
            <input type="submit" value="Wstaw">
            <input type="reset" value="Wyczysc">
        </form>
        <br><a href="form06_get.php">Przejdź do listy wszystkich pracowników</a><br>
        <?php
            if(isset($_SESSION["result"])) {
                if($_SESSION["result"] == 0) {
                    echo "<h3>Podano numer id pracownika, który już istnieje!</h3>";
                }
                else if($_SESSION["result"] == -1) {
                    echo "<h3>Nie podano wszystkich danych!</h3>";
                }
            }
            $_SESSION["result"] = 10;
        ?>
    </body>
</html>