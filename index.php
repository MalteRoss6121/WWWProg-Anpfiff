<!DOCTYPE html>
<html lang="eng">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <title>Anpfiff Flensburg</title>
</head>

<!--
<?php
include("connect.php");
$sql = "SELECT * FROM events ORDER BY id DESC";
$query = mysqli_query($con, $sql);
?>
-->


<body>
    <!--
    <?php
    include("header.html");
    ?>
    -->
    <script src="script.js"></script>
    
    <div class="firstContainer">
        <div class="firstContent">
            <span>
            </span>
            <a href="#events">
                <div class="btn-event">EVENTS</div>
            </a>
        </div>

    </div>


    <div class="eventsHead">
        <h1 id="events">EVENTS</h1>
    </div>
    <div class="eventContainer">
        <!--
        <?php
        while ($row = mysqli_fetch_object($query)) {
            echo "<a href='event.php?name=" . $row->id . "'><div class='event'>
            <img class='imgPlc' src='" . $row->image . "' /><br/>

            " . $row->headline . "</div></a>";
        }

        ?>
    -->

    </div>
    <div class="info">
        <div class="infoelement">
            <h2>Was machen wir?</h2>
            <p> In unserer Sportbar dreht sich alles um die perfekte Mischung aus Sport, Geselligkeit und Unterhaltung. Wir sind der ultimative Treffpunkt für Sportbegeisterte und Fans der sportlichen Atmosphäre.</p>
        </div>
        <div class="infoelement">
            <h2>Wo sind wir?</h2>
            <p> Unsere Sportbar befindet sich in Flensburg, DA WO BRANDON WOHNT, leicht erreichbar und perfekt für spontane Treffen oder geplante Abende. Schauen Sie vorbei und erleben Sie die Begeisterung in unserer gemütlichen Atmosphäre.</p>
        </div>
        <div class="infoelement">
            <h2>Wer sind wir?</h2>
            <p> Wir sind ein leidenschaftliches Team von Sportenthusiasten und Gastgebern. Unser Ziel ist es, Ihnen unvergessliche Erlebnisse zu bieten, sei es beim Anfeuern Ihrer Lieblingsmannschaften oder beim Genießen unserer breiten Auswahl an Getränken.</p>
        </div>
        <div class="infoelement">
            <h2>Was uns aus macht.</h2>
            <p> Unsere Leidenschaft für den Sport, unsere herzliche Gastfreundschaft und unser breites Angebot an Getränken. Wir laden Sie ein, Teil einer einzigartigen Atmosphäre zu werden, in der Sport und Geselligkeit Hand in Hand gehen.</p>
        </div>

        <div class="infoimg">
            <img src="">
        </div>
        <div class="infoimg2">
            <img src="">
        </div>
    </div>
    <div class="Contact">
        <h1>BESUCHT UNS GERNE! </h1>
        <h2>Kontaktiere Uns</h2>
        <p>
            Wir freuen uns, von Ihnen zu hören! Wenn Sie Fragen, Anmerkungen oder Anfragen haben,
            zögern Sie nicht, uns über E-mail oder übers Telefon zu erreichen. Wir sind bestrebt, Ihnen so
            schnell wie möglich zu antworten.
        </p>
        <ul>
            <li>Telefon: </li>
            <li>E-Mail: </li>
            <li>Kp was noch</li>
        </ul>
    </div>
</body>

<footer></footer>

</html>