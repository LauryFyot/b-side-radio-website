			<div class="comments-background">
				<h1 class="comments-title" data-aos="fade-in" data-aos-duration="500" id="comments">Commentaires</h1>
				<div class="comments-wrapper">
					<div class="header-comments">
						<h1 class="header-comments-title">Last comments :</h1>
					</div>
					<div class="comments-list">
						<div id="comments-inner">
				   			<?php include "comments.txt"?>
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
			   		<br><br>
			   		<input type="submit" name="Submit" value="Submit" class="Submit">
			   	</form>
			    </div>
			</div>
