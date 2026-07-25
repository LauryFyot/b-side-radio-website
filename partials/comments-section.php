			<div class="comments-background">
				<h1 class="comments-title" data-aos="fade-in" data-aos-duration="500" id="comments">Commentaires</h1>
				<div class="comments-wrapper">
					<div class="header-comments">
						<h1 class="header-comments-title">Last comments :</h1>
					</div>
					<div class="comments-list">
						<div id="comments-inner">
				   			<?php
				   			$comments = fetchApprovedComments(80);
				   			if (empty($comments)) {
				   				echo '<p class="comment-comments">Aucun commentaire approuve pour le moment.</p>';
				   			}

				   			foreach ($comments as $comment) {
				   				$name = htmlspecialchars($comment['author_name'] ?? '', ENT_QUOTES, 'UTF-8');
				   				$body = nl2br(htmlspecialchars($comment['body'] ?? '', ENT_QUOTES, 'UTF-8'), false);
				   				$date = htmlspecialchars(formatCommentDate($comment['created_at'] ?? ''), ENT_QUOTES, 'UTF-8');
				   				$icon = rand(1, 4);
				   				echo '<div class="comments-content"><div class="left"><img src="assets/images/Icon_user_' . $icon . '.png" class="icon-user" width="70" height="70"></div><div class="right"><h1 class="name-comments">' . $name . '</h1><p class="date-comments">' . $date . '</p><p class="comment-comments">' . $body . '</p></div></div>';
				   			}
				   			?>
				   		</div>
				    </div>
				</div>
				<div class="form-wrapper">
				<form action="" method="POST">
					<div class="segment">
    					<h1>Laissez nous un commentaire !</h1><br><p style="font-size:17px;">Demandez nous un titre !</p>
  					</div>
					<label>
			    		<input type="text" name="Name" class="Input" required placeholder="Name"/>
			    	</label>
			   		<br><br>
			   		<label class="text-comment"><br>
			    		<textarea name="Comment" class="Input" required placeholder="Comment"></textarea>
			   		</label>
				   	<div style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;" aria-hidden="true">
				   		<label for="website">Website</label>
				   		<input type="text" id="website" name="Website" tabindex="-1" autocomplete="off" />
				   	</div>
			   		<br><br>
			   		<input type="submit" name="Submit" value="Submit" class="Submit">
			   	</form>
			    </div>
			</div>
