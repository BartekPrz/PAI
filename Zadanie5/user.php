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

            if($_SESSION["zalogowany"] == 1) {
                echo "Zalogowano <br><br>";
                echo "Imię i nazwisko użytkownika: " . $_SESSION["zalogowanyImie"] . "<br><br>";

            }
            else {
                header("Location: index.php");
            }
        ?>
        <a href="index.php">Wróć do panelu logowania index.php</a><br><br>
        <form action="index.php" method="post">
            <fieldset>
                <legend>Wylogowywanie: </legend>
                <input type="submit" value="Wyloguj" name="wyloguj">
            </fieldset>
        </form>

        <form action="user.php" method="post" enctype='multipart/form-data'>
            <fieldset>
                <legend>Prześlij plik na serwer: </legend>
                <input type="file" name="myfile">
                <input type="submit" name="upload">
            </fieldset>
        </form>

        <?php
            if(isSet($_POST["upload"])) {
                $currentDir = getcwd();
                $uploadDirectory = "/ZdjeciaUzytkownikow/";
                $fileName = $_FILES['myfile']['name'];
                $fileType = $_FILES['myfile']['type'];
                $fileTmpName = $_FILES['myfile']['tmp_name'];

                if($fileName != "" && ($fileType == 'image/png' || $fileType == 'image/jpeg' || $fileType == 'image/JPEG') || $fileType == 'image/PNG') {
                    $uploadPath = $currentDir . $uploadDirectory . $fileName;
                    if(move_uploaded_file($fileTmpName, $uploadPath))
                        echo "Zdjęcie zostało załadowane na serwer";
                }
            }
        ?>
            
        <?php
            if(file_exists("ZdjeciaUzytkownikow/photo.jpg")) {
                echo '<br><img src="ZdjeciaUzytkownikow/photo.jpg" alt="Zdjecie Uzytkownika">';
            }
            else {
                echo "Czekam na zdjęcie użytkownika przesłane na serwer";
            }
        ?>
    </body>
</html>