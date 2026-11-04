<?php
/**
 * Theme footer.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$devhorizon_tracks = devhorizon_get_tracks( array( 'keynote' ) );
?>
<footer class="site-footer">
	<div class="container">
		<div class="footer-top">
			<div class="footer-brand">
				<a class="brand-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">DEVHORIZON_26</a>
				<p class="footer-desc">
					<?php esc_html_e( 'A three-day conference for engineers who build the interfaces humans use every day.', 'tech-conference-site' ); ?>
				</p>
			</div>

			<div class="footer-col">
				<h3 class="footer-col-title">// <?php esc_html_e( 'NAVIGATE', 'tech-conference-site' ); ?></h3>
				<?php devhorizon_nav_menu( 'footer-links' ); ?>
			</div>

			<div class="footer-col">
				<h3 class="footer-col-title">// <?php esc_html_e( 'TRACKS', 'tech-conference-site' ); ?></h3>
				<ul class="footer-links">
					<?php if ( ! empty( $devhorizon_tracks ) ) : ?>
						<?php foreach ( $devhorizon_tracks as $devhorizon_track ) : ?>
							<li>
								<a href="<?php echo esc_url( add_query_arg( 'track', $devhorizon_track->slug, devhorizon_page_url( 'schedule' ) ) ); ?>">
									<?php echo esc_html( $devhorizon_track->name ); ?>
								</a>
							</li>
						<?php endforeach; ?>
					<?php else : ?>
						<li><?php esc_html_e( 'Tracks to be announced', 'tech-conference-site' ); ?></li>
					<?php endif; ?>
				</ul>
			</div>

			<div class="footer-col">
				<h3 class="footer-col-title">// <?php esc_html_e( 'VENUE', 'tech-conference-site' ); ?></h3>
				<p class="venue-text">
					Pier 70<br />
					San Francisco, CA<br />
					Nov 15&ndash;17, 2026
				</p>
			</div>
		</div>

		<div class="footer-bottom">
			<div>&copy; 2026 DEVHORIZON. <?php esc_html_e( 'ALL RIGHTS RESERVED.', 'tech-conference-site' ); ?></div>
			<a href="#top"><?php esc_html_e( 'BACK TO TOP', 'tech-conference-site' ); ?> &uarr;</a>
		</div>
	</div>
</footer>

<?php get_template_part( 'template-parts/modal-speaker' ); ?>
<?php wp_footer(); ?>
</body>
</html>
