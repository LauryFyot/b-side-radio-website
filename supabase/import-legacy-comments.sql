-- Replaces ALL current comments with the historical comments from both exports.
-- Sources: assets/comments 2.txt; assets/comments15112023.txt.
-- 230 source entries; 15 spam entries excluded; 114 duplicates removed; 101 comments retained.
-- Deduplication: normalized author + body, retaining the earliest date.
-- Original spelling and emojis retained; whitespace normalized; no invented emails or likes.
-- Backup keeps the pre-import comments on the FIRST execution only.
-- Run in the Supabase SQL editor as postgres. Do not run if current comments must be retained.

begin;

lock table public.comments in access exclusive mode;
create schema if not exists legacy_comment_backup;
revoke all on schema legacy_comment_backup from public, anon, authenticated;
create table if not exists legacy_comment_backup.comments_before_import as
  select * from public.comments;
revoke all on table legacy_comment_backup.comments_before_import from public, anon, authenticated;

delete from public.comments;

insert into public.comments (author_name, body, status, created_at)
values
  ('Titi', 'Magnifaiiiique ce nouveau siteBises', 'approved', timestamp '2019-12-14 20:07:00' at time zone 'Europe/Paris'),
  ('Titi', 'Un p’tit coucou', 'approved', timestamp '2019-12-30 22:55:00' at time zone 'Europe/Paris'),
  ('Lorinsk', 'toujours aussi bon le son !!!!!les DJs Bart et By-Eddy assurent comme dabje kiffffJe vous adorelolo', 'approved', timestamp '2020-02-01 23:50:00' at time zone 'Europe/Paris'),
  ('BesTof Music by djTof', 'Hey les copains. Ca zic comme d''hab. Refonte du site top. Ne changez rien, vous êtes au top.A bientôt sur Gre, je m''emploie à vous faire connaitre. Sur mon site, https://besttofmusic.fr/je vous ai mis un lien clicable avec votre logo. Bise. Musicalement Vôtre. DjTof', 'approved', timestamp '2021-04-23 11:55:00' at time zone 'Europe/Paris'),
  ('Chouchou', 'Toujours un regal a vous écouter, que du bon son !!Continuez,et changez rien. Enjoy !!!Bisous a toute la Team.Chouchou91', 'approved', timestamp '2021-04-24 10:48:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Je suis fan des mix que vou passezIl en faudrait plus cest original et bien mixe encore plus svpContinuez', 'approved', timestamp '2021-04-27 23:08:00' at time zone 'Europe/Paris'),
  ('Mehdi', 'Merci Eddy de m''avoir fait connaître cette belle radio. Au TOP c''est tout ce que j''aime. Je sais ce que je vais écouter dans la voiture maintenant 😉Continuez comme ça 👍', 'approved', timestamp '2021-04-28 00:02:00' at time zone 'Europe/Paris'),
  ('Dj bart', 'Merci pour c’est message , cela fait du bien de savoir que ce que l’on fait vous plaîtEt on vous donne rdv samedi soir', 'approved', timestamp '2021-04-29 13:12:00' at time zone 'Europe/Paris'),
  ('Sach', 'On dirait un direct de l échappatoire Cetait le bon vieux temps', 'approved', timestamp '2021-04-30 19:19:00' at time zone 'Europe/Paris'),
  ('Byeddy', 'Oui et donna summer qui arrive', 'approved', timestamp '2021-04-30 19:20:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Salut on pourrait avoir les titres qui passent ya des trucs vraiment bon ya que ici quils passentLes mix trop fortCa continu A bientôt', 'approved', timestamp '2021-04-30 23:19:00' at time zone 'Europe/Paris'),
  ('Byeddy', 'Salut Lan, Pour avoir les noms des titres, il suffit de noter l''heure du passage et la date.Par contre, ne pas attendre plus d''une journée car j''efface les playlists tous les 2 j..À bientôt et bonne écoute sur B side.radio', 'approved', timestamp '2021-05-01 14:23:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'SalutCtki la reprise de jocelyn brown à 19h15Supetbe', 'approved', timestamp '2021-05-03 19:18:00' at time zone 'Europe/Paris'),
  ('Byeddy', 'Salut lanLe titre à 19h15 c''était Beverlei brown...gonna get over youEthan wood 2021 rmxVoili voilouMerci de nous suivre', 'approved', timestamp '2021-05-03 21:41:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Salut onpeux avoir le tracklist du mix stp. Si je peux trouver les titres.Cest du mix pro j''adore', 'approved', timestamp '2021-05-04 21:39:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Bonsoir Lan, Ravi de voir que tu apprécie nos mixes. Pour la tracklist de ce soir, je te l''envoie sur fb.Reste bien branché(e) T''es au top!...', 'approved', timestamp '2021-05-04 22:24:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Ya bien les mix ce soirCest pas annonce J''espère', 'approved', timestamp '2021-05-15 18:46:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Bonsoir lanOui, comme tous les samedis ...Pas eu le temps de publier l''annonce.Bonne écoute sur bside radioEddy', 'approved', timestamp '2021-05-15 21:03:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Salut tout le mobdeJ''ecoute depuis 19h. Les mix dechirent total. Plein les oreilles et cest oas fini.Continuez à nous regaler.Arnaud du sud', 'approved', timestamp '2021-05-30 00:52:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Hello Mix enormes depuis 19h.Je decourve la jackin ce soirC''est vraiment du bon son.J''attends aussi les mix funkyvhouse ce soir.Vous nous regalez Bon mixArnaud du sud', 'approved', timestamp '2021-06-05 22:26:00' at time zone 'Europe/Paris'),
  ('Dj bart', 'Bonjour Arnaud L’équipe de B-bside est ravi que tu passes de très bonnes soirées à nous écouter Hésite pas à parler de nous à ton entourageBon vine à toi B-side-radio', 'approved', timestamp '2021-06-13 17:24:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Y a que des jingles depuis 19h00...', 'approved', timestamp '2021-06-17 19:06:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Salut LanHé oui, les mystères de l''informatique...Ça y est, c''est reparti. On retrouve la nouvelle playlist de la semaine by djBart dès mardi car lundi.....fête de la musique oblige, que du don dancefloor dès 17h...A bientôt ByEddy', 'approved', timestamp '2021-06-17 19:09:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Le son est bizarre mais les nix sont très bon je voudrais les titres demain. Kif', 'approved', timestamp '2021-07-09 20:31:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Bien les remix de funkLes annees 80 en version2021 très tres bon. Ca nous changeContinuez...', 'approved', timestamp '2021-07-09 20:34:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Les gars vous nous faites une soirée hyper variée C''est au top 3 styles différents et c''est pas finiJe reste jusqu''à la fermetureArnaud du sud', 'approved', timestamp '2021-07-10 23:23:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Les gars je trouve pas vos versionsMichael Jackson Kool and the gang et maintenant Yazoo Dinguerie', 'approved', timestamp '2021-07-10 23:47:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'La vache le remix de club tropicana', 'approved', timestamp '2021-07-30 23:39:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Je voudrais plus de mix finkhouseCette semaine yen avait plein le soirEn plus si quelqu''un a une methode ppur enregistré coolDes mixs', 'approved', timestamp '2021-08-04 19:01:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Bonsoir LanJe prepare des playlists funkyhouse des années 80 pour vendredi...Real funk mais tjs avec le son 2021..Alors à très vite et merci d''être là...Eddy', 'approved', timestamp '2021-08-04 20:57:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Salut les garsQuelle pêche la prog ce soirDu bln gros son La suite', 'approved', timestamp '2021-08-06 22:36:00' at time zone 'Europe/Paris'),
  ('Chouchou', 'Merci pour cette hommage à Paul Jonhson, j''ai adoré. Ca rappelle des bons souvenirs. RIP and Thank you mister DJ🙏! C''était 🔊🔊😍😍', 'approved', timestamp '2021-08-07 19:06:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Hello chouchouDj LeCyr prend un grand plaisir à lui rendre hommage par ses mixes.Mercii à lui erMerci à toi ppur ton soutien....Reste branché 💥💕👌', 'approved', timestamp '2021-08-07 21:20:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Salut les gars du bon gros son ce soir La rentrée est bien la la suite vite', 'approved', timestamp '2021-09-04 22:32:00' at time zone 'Europe/Paris'),
  ('Le couz du Nord', 'Merci pour l''envois, continuez comme ça vous êtes super', 'approved', timestamp '2021-09-18 20:33:00' at time zone 'Europe/Paris'),
  ('Dj bart from Bside', 'ByEddy est en mega forme 👍👍', 'approved', timestamp '2021-09-18 22:19:00' at time zone 'Europe/Paris'),
  ('le velizien', 'le son deboite grave merci bside', 'approved', timestamp '2021-09-18 23:44:00' at time zone 'Europe/Paris'),
  ('le velizien', 'le son est au top merci bside et a dj bart', 'approved', timestamp '2021-09-18 23:45:00' at time zone 'Europe/Paris'),
  ('dj bart from bside', 'merci aux 300 auditeur connecter ce soir', 'approved', timestamp '2021-09-18 23:47:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Ce soir cest soirée funk ça roule comme jamais.J''adore', 'approved', timestamp '2021-09-24 23:22:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Salut on edt 5 ce soir a une bonne table a la maison on ecoute ts mixDamien demande sur quoi tu mix si cest du pionneerEn tous cas ca booooooom', 'approved', timestamp '2021-10-08 23:41:00' at time zone 'Europe/Paris'),
  ('Dj bart from Bside radio', 'Bonjour Lan92Pour Rémi ère à ta question. Oui je mix sur des cdj 900 Merci de nous écoutez avec tes amis', 'approved', timestamp '2021-10-15 09:44:00' at time zone 'Europe/Paris'),
  ('Dj bart from Bside radio', 'Hello les bsiders Nous avons un page FB donc hésiter pas à nous laisser vos encouragement et surtout à partager notre page pour nous faire connaître Merci d’avance à vous tous A samedi soir 😘', 'approved', timestamp '2021-10-15 09:51:00' at time zone 'Europe/Paris'),
  ('Le Velizien', 'Comme dab le son tape fort Merci Bside Merci DJ BART', 'approved', timestamp '2021-10-16 22:47:00' at time zone 'Europe/Paris'),
  ('Coralie', 'Qui est ce dj en ce moment ? 22h25 J adoreeeeeeee', 'approved', timestamp '2021-11-06 22:26:00' at time zone 'Europe/Paris'),
  ('Dj bart from Bside', 'Bonsoir coralie Il s’appelle DJ SCRYLL', 'approved', timestamp '2021-11-09 17:23:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Salut Ya que des jingle depuis 19hCa y est c''est revrnu en musique..Funk mix en plus🙂', 'approved', timestamp '2021-11-17 19:36:00' at time zone 'Europe/Paris'),
  ('Coralie', 'De la bombe 💣💣💣💣💣💣', 'approved', timestamp '2021-12-11 23:45:00' at time zone 'Europe/Paris'),
  ('Dj bart from bsr', 'Merci coralie De la part de l’équipe de BSR', 'approved', timestamp '2021-12-12 00:38:00' at time zone 'Europe/Paris'),
  ('Bertrand paris 8', 'Très bonne radio sans blabla ni pub.je mets dans le magasin et cet après-midi va bien passer.La dance bien mixée super!Bon reveillon à tous', 'approved', timestamp '2021-12-31 14:27:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Alors c''est quoi ce stonesTrop cool on oeux le trouver oùEnvoyez moi', 'approved', timestamp '2021-12-31 14:29:00' at time zone 'Europe/Paris'),
  ('Louisa', 'Bonjour Mon fils m''a dit cette radio c''est ta musique.Effectivement,que des tubes de mes meilleures années.je nr connais pas ces versions là mais c''est super à écouter.Je vais la laisser avec mes invités jusqu''à l''aube.Merci mon fils ;-)', 'approved', timestamp '2021-12-31 14:49:00' at time zone 'Europe/Paris'),
  ('Lan 92', 'Salut la team ya pas les jingle', 'approved', timestamp '2021-12-31 15:15:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Encore un stones de malade cool', 'approved', timestamp '2021-12-31 15:55:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'On dirait que ce mix est déjà passé', 'approved', timestamp '2021-12-31 16:24:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Bonsoir Bertrand du 8eme.J''espère que les ventes ont suivi pour cette dernière journée de 2021.Merci d''etre avec nous.Bon reveillon..Eddy', 'approved', timestamp '2021-12-31 18:24:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', '@ Arnaud...Bonsoir, oui les Rolling Stones en rmx c sympa...Y'' a des bugs informatiques qui ont fait que ce mix passe 2 fois...À 18h , on part en funk et aprèsDj lecyr...Bonne soirée et à l''année prochaine.Eddy', 'approved', timestamp '2021-12-31 18:26:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', '@louisaBonsoir Louisa,Merci de nous écouter et d''apprecier...Alors, jusqu''au bout dd la nuit...À bientôt.Eddy', 'approved', timestamp '2021-12-31 18:28:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', '@Lan du 92 Oui, les jingles c''est surtout les vendredis et samedis .Aller, quelques-uns...Merci d''etre làEddy', 'approved', timestamp '2021-12-31 18:30:00' at time zone 'Europe/Paris'),
  ('Dj BART @ bside radio', 'Vos sms font hyper plaizzzBon réveillon à tous Encore merci de nous écouter', 'approved', timestamp '2021-12-31 23:41:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Superbe soirée totale funk je suis pas couchéQue du très bon son ce soir belle nuit tout le monde', 'approved', timestamp '2022-03-12 00:59:00' at time zone 'Europe/Paris'),
  ('Le couz du Nord', 'C''est toujours un plaisir de vous écouter avec cette musique qui vous envoûte jusqu''au bout de la nuit le week-end. Bonne continuation à tous avec vos mix d''enfer.', 'approved', timestamp '2022-06-17 20:44:00' at time zone 'Europe/Paris'),
  ('Dj bart from bsr', 'Salut le couz Un grand merci pour ton sms Kiss', 'approved', timestamp '2022-06-27 16:25:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Hi le mix de 17h funky dechireLe top', 'approved', timestamp '2022-10-14 17:27:00' at time zone 'Europe/Paris'),
  ('ByEddy@B.side radio', 'Bonsoir Arnaud, merci d´avoir apprécié le funky mix passé cet am.On essaie d´être pointus sur nos mixes....A très bien tôt Enjoy BSR', 'approved', timestamp '2022-10-15 00:30:00' at time zone 'Europe/Paris'),
  ('MAXENCE', 'c''est vous qui faites ces remix de street life merci', 'approved', timestamp '2022-11-11 16:29:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Bonjour Maxence, Dsl pour le retard à l''allumage.. Pas celui-là. C''est AN:RO - street lifeMerci pour ton écoute attentive.. Eddy', 'approved', timestamp '2022-11-18 19:14:00' at time zone 'Europe/Paris'),
  ('Le bar 83', 'Salut onpeut avoir la playlist de 19 ey celle de maintenant merci', 'approved', timestamp '2023-01-06 22:58:00' at time zone 'Europe/Paris'),
  ('dj bart', 'le bar 83 tu ne veux pas les mixes directement ?', 'approved', timestamp '2023-01-23 18:34:00' at time zone 'Europe/Paris'),
  ('Did', 'Avec cette radio on passe de superbes moments on en ressort boosté .....', 'approved', timestamp '2023-03-03 21:03:00' at time zone 'Europe/Paris'),
  ('eddy B side radio', 'C''est unique et c''est sur b side radio ...', 'approved', timestamp '2023-03-03 21:05:00' at time zone 'Europe/Paris'),
  ('Did', 'Comme je dis tous les jours BSIDE RADIO La radio qu il me faut ....Osez l écoute...', 'approved', timestamp '2023-03-04 09:37:00' at time zone 'Europe/Paris'),
  ('Alain', 'Merci pour cette bonne musique', 'approved', timestamp '2023-03-08 07:10:00' at time zone 'Europe/Paris'),
  ('kevin', 'J aime bien tous vos remix Bravo', 'approved', timestamp '2023-03-08 07:15:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Merci Kevin & Alain pour votre soutien...Nouvelle programmation aujourd´hui..profitez....', 'approved', timestamp '2023-03-08 08:05:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'Tous ses mix d´enfer ce soir je dois coupé et merci eddy pour le mix parfait dema playlist jen ferais unexautre bientôt maintenant sue jecsai quoi mettre à bientôt', 'approved', timestamp '2023-03-11 00:51:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'c''est bof ce mix du nouveau c''est pas notre music', 'approved', timestamp '2023-03-25 20:02:00' at time zone 'Europe/Paris'),
  ('Loïc', 'Techno house à 19 h ????🤔🤔', 'approved', timestamp '2023-03-25 20:55:00' at time zone 'Europe/Paris'),
  ('dj bart from bside radio', 'bonjour arnaud et loïc nous prenons note de votre marque, nous voulions faire un essai avec un nouveau dj qui n’a pas l’air de vous plaireEncore merci pour vos remarquesMerci de nous écouter😘', 'approved', timestamp '2023-03-26 11:16:00' at time zone 'Europe/Paris'),
  ('Bertrand paris 8', 'bonsoir, là je peux pas mettre dans le magasin. Dommage, je ferme à 20h Bonne soirée a tous.', 'approved', timestamp '2023-04-01 19:45:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'salut tout le monde Vivement les autres dj c ''est parti', 'approved', timestamp '2023-04-08 20:01:00' at time zone 'Europe/Paris'),
  ('jean marc', 'cool dj bart est de retrour', 'approved', timestamp '2023-04-29 18:24:00' at time zone 'Europe/Paris'),
  ('Alain', 'Salut ile st possible d''avoir la liste des titres de 19h des bonnes nouveautes merci', 'approved', timestamp '2023-05-05 19:39:00' at time zone 'Europe/Paris'),
  ('Alain', 'Celui de 20h aussi et celui de 21h qui tape aussi merci', 'approved', timestamp '2023-05-05 23:50:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Salut Alain. Merci d''être tjs là. Pour les playlists, passe en mp sur le mail de la radio. Tu auras même droit aux titres à écouter chez toi !! A très vite.', 'approved', timestamp '2023-05-06 15:25:00' at time zone 'Europe/Paris'),
  ('Bertrand', 'bonsoir yeke avec boris bresja fallait oser c''est fait impecc', 'approved', timestamp '2023-05-12 19:20:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'salut je shazam les morceaux mais il les trouve pas tous ca viens d''ou tous ca c ce serait bien d''avoir les playlist parceque les mix sont top merci', 'approved', timestamp '2023-05-12 23:11:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Salut Arnaud. Certains titres sont envoyés par la prod donc peut-être un peu en avance sur la mise à disposition mais ça devrait suivre. Sinon, passe en mail et je t''envoie les playlists...Merci d''être toujours là.', 'approved', timestamp '2023-05-13 16:38:00' at time zone 'Europe/Paris'),
  ('dj bart from bsr', 'hello les bsiders pas d’inquiétude nous allons revenir très bientôt. Nous avons un gros souci technique que nous sommes en train de régler.', 'approved', timestamp '2023-10-25 17:21:00' at time zone 'Europe/Paris'),
  ('Le couz du nord', 'Quel plaisir de vous écouter à nouveau. Merci à toute l''équipe.', 'approved', timestamp '2023-11-12 16:09:00' at time zone 'Europe/Paris'),
  ('Did', 'Cette web est vraiment top . Beaucoup de nouveautés remixes . Enfin quelque chose qui tient la route.. Merci et bravo à toute l équipe', 'approved', timestamp '2023-11-15 20:36:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Salut tout le monde, La radio repart ce jeudi 15 novembre avec 250 nouveautés en rotations toute la semaine et les sessions mixes: les mardis 20h/1h et les samedis 19/3h, sans oublier le replay le dimanche de 14h à 20h. Bonne écoute et merci d''être toujours là.', 'approved', timestamp '2023-11-16 00:06:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'J''invite par la même occasion l''auditeur de Lille à venir ici nous faire un petit coucou !', 'approved', timestamp '2023-11-16 00:08:00' at time zone 'Europe/Paris'),
  ('Florence', 'je decouvre votre radio par ma belle soeur qui est venue sur votre domaine. Elle a dit que c''etait pour moi. Effectivement j''ai ecoute le s mix d''hier soir. C''est l a 1ere fois que j''entend autant de chansons en 1h. c''est vraiment en direct ? Et est c''est genial d''entendre autant d''effets. Ce soir je recois et je vais mettre la radio. A ce soir! Flo', 'approved', timestamp '2023-11-18 16:00:00' at time zone 'Europe/Paris'),
  ('Did', 'Je voulais remercier le Dj qui a mixer ce samedi 18 novenbre de 21 à 22h car j ai passé vraiment un agréable moment je vous souhaite de la réussite.....au plaisir de vous entendre a nouveau bye bye', 'approved', timestamp '2023-11-18 21:55:00' at time zone 'Europe/Paris'),
  ('Florence', 'hier soir , on était 20 à danser jusqu''à 2h. C''était vraiment de la bonne musique .Efficace .Merci beaucoup. Au bureau pour la semaine prochaine. Bye Flo', 'approved', timestamp '2023-11-19 10:28:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', 'Bonsoir Flo, Merci pour ton soutien avec ce message très encourageant. On essais d''être bons et de nous démarquer des autres. Continue de nous suivre et nous raconter tes soirées. Bonne écoute sur B Side', 'approved', timestamp '2023-11-19 18:39:00' at time zone 'Europe/Paris'),
  ('Eddy b side radio', '@ Did ... Merci Did, c''était Dj Le Cyr à 21h ce samedi. Ca lui a fait très plezzz. Continue d''écouter B Side.. Thk U', 'approved', timestamp '2023-11-19 18:41:00' at time zone 'Europe/Paris'),
  ('Arnaud', 'C''est quoi ce mix de malade depuis 23h Y''a 3 disuqes en même temps au moins. De dingue Tuuurie', 'approved', timestamp '2023-11-24 23:50:00' at time zone 'Europe/Paris'),
  ('Did', 'Dimanche 26/11 de 16h00 à 17h00 Merci pour ce super moment .', 'approved', timestamp '2023-11-26 17:07:00' at time zone 'Europe/Paris'),
  ('Did', 'Dimanche 26/ 11 encore moi de 17h00 à 19h00 . je devais quitté plus tôt la web et là…. tellement que tous s’enchainent avec des rythmes d’enfer je suis encore là ……ces Mix sont terribles et je vais même rester jusqu’ à 20h00 …. Vraiment génial cette web radio … Bravo et Merci à toute l’équipe .', 'approved', timestamp '2023-11-26 19:03:00' at time zone 'Europe/Paris');

update public.comments set status = 'approved';

do $$
begin
  if (select count(*) from public.comments) <> 101 then
    raise exception 'Historical comment import count mismatch';
  end if;
end;
$$;

commit;

select count(*) as imported_comments, min(created_at) as oldest, max(created_at) as newest
from public.comments;
