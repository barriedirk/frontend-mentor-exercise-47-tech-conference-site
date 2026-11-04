<?php
/**
 * Metadatos y metaboxes nativos.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registra los metadatos de speakers y sesiones.
 */
function devhorizon_register_post_meta() {
	$speaker_meta = array(
		'_devhorizon_role'     => 'string',
		'_devhorizon_company'  => 'string',
		'_devhorizon_featured' => 'boolean',
	);

	foreach ( $speaker_meta as $key => $type ) {
		register_post_meta(
			'devhorizon_speaker',
			$key,
			array(
				'type'              => $type,
				'single'            => true,
				'show_in_rest'      => false,
				'sanitize_callback' => 'boolean' === $type ? 'rest_sanitize_boolean' : 'sanitize_text_field',
			)
		);
	}

	$session_meta = array(
		'_devhorizon_speaker_id'    => 'integer',
		'_devhorizon_day'           => 'integer',
		'_devhorizon_start_time'    => 'string',
		'_devhorizon_end_time'      => 'string',
		'_devhorizon_start_minutes' => 'integer',
		'_devhorizon_location'      => 'string',
		'_devhorizon_highlighted'   => 'boolean',
	);

	foreach ( $session_meta as $key => $type ) {
		register_post_meta(
			'devhorizon_session',
			$key,
			array(
				'type'              => $type,
				'single'            => true,
				'show_in_rest'      => false,
				'sanitize_callback' => 'integer' === $type ? 'absint' : ( 'boolean' === $type ? 'rest_sanitize_boolean' : 'sanitize_text_field' ),
			)
		);
	}
}
add_action( 'init', 'devhorizon_register_post_meta' );

/**
 * Registra los metaboxes.
 */
function devhorizon_add_meta_boxes() {
	add_meta_box(
		'devhorizon_speaker_details',
		__( 'Datos del speaker', 'tech-conference-site' ),
		'devhorizon_render_speaker_metabox',
		'devhorizon_speaker',
		'normal',
		'high'
	);

	add_meta_box(
		'devhorizon_session_details',
		__( 'Datos de la sesión', 'tech-conference-site' ),
		'devhorizon_render_session_metabox',
		'devhorizon_session',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'devhorizon_add_meta_boxes' );

/**
 * Renderiza el metabox de speaker.
 *
 * @param WP_Post $post Post actual.
 */
function devhorizon_render_speaker_metabox( $post ) {
	$role     = (string) get_post_meta( $post->ID, '_devhorizon_role', true );
	$company  = (string) get_post_meta( $post->ID, '_devhorizon_company', true );
	$featured = (bool) get_post_meta( $post->ID, '_devhorizon_featured', true );

	wp_nonce_field( 'devhorizon_speaker_meta', 'devhorizon_speaker_nonce' );
	?>
	<p>
		<label for="devhorizon_role"><strong><?php esc_html_e( 'Rol', 'tech-conference-site' ); ?></strong></label><br />
		<input type="text" class="widefat" id="devhorizon_role" name="devhorizon_role" value="<?php echo esc_attr( $role ); ?>" placeholder="<?php esc_attr_e( 'Principal Frontend Engineer', 'tech-conference-site' ); ?>" />
	</p>
	<p>
		<label for="devhorizon_company"><strong><?php esc_html_e( 'Empresa', 'tech-conference-site' ); ?></strong></label><br />
		<input type="text" class="widefat" id="devhorizon_company" name="devhorizon_company" value="<?php echo esc_attr( $company ); ?>" placeholder="<?php esc_attr_e( 'Bytecraft', 'tech-conference-site' ); ?>" />
	</p>
	<p>
		<label>
			<input type="checkbox" name="devhorizon_featured" value="1" <?php checked( $featured ); ?> />
			<?php esc_html_e( 'Destacar este speaker en la home', 'tech-conference-site' ); ?>
		</label>
	</p>
	<p class="description">
		<?php esc_html_e( 'La biografía se escribe en el editor y la foto se asigna como imagen destacada.', 'tech-conference-site' ); ?>
	</p>
	<?php
}

/**
 * Renderiza el metabox de sesión.
 *
 * @param WP_Post $post Post actual.
 */
function devhorizon_render_session_metabox( $post ) {
	$speaker_id  = (int) get_post_meta( $post->ID, '_devhorizon_speaker_id', true );
	$day         = (int) get_post_meta( $post->ID, '_devhorizon_day', true );
	$start_time  = (string) get_post_meta( $post->ID, '_devhorizon_start_time', true );
	$end_time    = (string) get_post_meta( $post->ID, '_devhorizon_end_time', true );
	$location    = (string) get_post_meta( $post->ID, '_devhorizon_location', true );
	$highlighted = (bool) get_post_meta( $post->ID, '_devhorizon_highlighted', true );
	$speakers    = get_posts(
		array(
			'post_type'      => 'devhorizon_speaker',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
		)
	);

	if ( ! $day ) {
		$day = 1;
	}

	wp_nonce_field( 'devhorizon_session_meta', 'devhorizon_session_nonce' );
	?>
	<p>
		<label for="devhorizon_speaker_id"><strong><?php esc_html_e( 'Speaker', 'tech-conference-site' ); ?></strong></label><br />
		<select id="devhorizon_speaker_id" name="devhorizon_speaker_id" class="widefat">
			<option value="0"><?php esc_html_e( '— Selecciona un speaker —', 'tech-conference-site' ); ?></option>
			<?php foreach ( $speakers as $speaker ) : ?>
				<option value="<?php echo esc_attr( $speaker->ID ); ?>" <?php selected( $speaker_id, $speaker->ID ); ?>>
					<?php echo esc_html( $speaker->post_title ); ?>
				</option>
			<?php endforeach; ?>
		</select>
	</p>
	<?php if ( empty( $speakers ) ) : ?>
		<p class="description">
			<?php
			printf(
				/* translators: %s: URL de la página de importación. */
				esc_html__( 'Todavía no hay speakers. Ejecuta el importador en %s.', 'tech-conference-site' ),
				'<a href="' . esc_url( admin_url( 'tools.php?page=devhorizon-import' ) ) . '">' . esc_html__( 'Herramientas → Importar DevHorizon', 'tech-conference-site' ) . '</a>'
			);
			?>
		</p>
	<?php endif; ?>
	<p>
		<label for="devhorizon_day"><strong><?php esc_html_e( 'Día', 'tech-conference-site' ); ?></strong></label><br />
		<select id="devhorizon_day" name="devhorizon_day">
			<option value="1" <?php selected( $day, 1 ); ?>><?php esc_html_e( 'Día 1', 'tech-conference-site' ); ?></option>
			<option value="2" <?php selected( $day, 2 ); ?>><?php esc_html_e( 'Día 2', 'tech-conference-site' ); ?></option>
			<option value="3" <?php selected( $day, 3 ); ?>><?php esc_html_e( 'Día 3', 'tech-conference-site' ); ?></option>
		</select>
	</p>
	<p>
		<label for="devhorizon_start_time"><strong><?php esc_html_e( 'Hora inicial', 'tech-conference-site' ); ?></strong></label><br />
		<input type="text" id="devhorizon_start_time" name="devhorizon_start_time" value="<?php echo esc_attr( $start_time ); ?>" placeholder="9:00" />
		<label for="devhorizon_end_time" style="margin-left:16px;"><strong><?php esc_html_e( 'Hora final', 'tech-conference-site' ); ?></strong></label>
		<input type="text" id="devhorizon_end_time" name="devhorizon_end_time" value="<?php echo esc_attr( $end_time ); ?>" placeholder="10:00" />
	</p>
	<p>
		<label for="devhorizon_location"><strong><?php esc_html_e( 'Localización', 'tech-conference-site' ); ?></strong></label><br />
		<input type="text" class="widefat" id="devhorizon_location" name="devhorizon_location" value="<?php echo esc_attr( $location ); ?>" placeholder="Room A" />
	</p>
	<p>
		<label>
			<input type="checkbox" name="devhorizon_highlighted" value="1" <?php checked( $highlighted ); ?> />
			<?php esc_html_e( 'Destacar esta sesión en la home', 'tech-conference-site' ); ?>
		</label>
	</p>
	<p class="description">
		<?php esc_html_e( 'El track se asigna desde la caja de la taxonomía “Tracks”. La descripción se escribe en el editor.', 'tech-conference-site' ); ?>
	</p>
	<?php
}

/**
 * Guarda los metadatos del speaker.
 *
 * @param int $post_id ID del post.
 */
function devhorizon_save_speaker_meta( $post_id ) {
	if ( ! isset( $_POST['devhorizon_speaker_nonce'] ) ) {
		return;
	}

	$nonce = sanitize_text_field( wp_unslash( $_POST['devhorizon_speaker_nonce'] ) );

	if ( ! wp_verify_nonce( $nonce, 'devhorizon_speaker_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( wp_is_post_revision( $post_id ) || 'devhorizon_speaker' !== get_post_type( $post_id ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$role     = isset( $_POST['devhorizon_role'] ) ? sanitize_text_field( wp_unslash( $_POST['devhorizon_role'] ) ) : '';
	$company  = isset( $_POST['devhorizon_company'] ) ? sanitize_text_field( wp_unslash( $_POST['devhorizon_company'] ) ) : '';
	$featured = isset( $_POST['devhorizon_featured'] ) ? 1 : 0;

	update_post_meta( $post_id, '_devhorizon_role', $role );
	update_post_meta( $post_id, '_devhorizon_company', $company );
	update_post_meta( $post_id, '_devhorizon_featured', $featured );
}
add_action( 'save_post', 'devhorizon_save_speaker_meta' );

/**
 * Guarda los metadatos de la sesión.
 *
 * @param int $post_id ID del post.
 */
function devhorizon_save_session_meta( $post_id ) {
	if ( ! isset( $_POST['devhorizon_session_nonce'] ) ) {
		return;
	}

	$nonce = sanitize_text_field( wp_unslash( $_POST['devhorizon_session_nonce'] ) );

	if ( ! wp_verify_nonce( $nonce, 'devhorizon_session_meta' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( wp_is_post_revision( $post_id ) || 'devhorizon_session' !== get_post_type( $post_id ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$speaker_id  = isset( $_POST['devhorizon_speaker_id'] ) ? absint( $_POST['devhorizon_speaker_id'] ) : 0;
	$day         = isset( $_POST['devhorizon_day'] ) ? absint( $_POST['devhorizon_day'] ) : 1;
	$start_time  = isset( $_POST['devhorizon_start_time'] ) ? sanitize_text_field( wp_unslash( $_POST['devhorizon_start_time'] ) ) : '';
	$end_time    = isset( $_POST['devhorizon_end_time'] ) ? sanitize_text_field( wp_unslash( $_POST['devhorizon_end_time'] ) ) : '';
	$location    = isset( $_POST['devhorizon_location'] ) ? sanitize_text_field( wp_unslash( $_POST['devhorizon_location'] ) ) : '';
	$highlighted = isset( $_POST['devhorizon_highlighted'] ) ? 1 : 0;
	$day         = max( 1, min( 3, $day ) );

	update_post_meta( $post_id, '_devhorizon_speaker_id', $speaker_id );
	update_post_meta( $post_id, '_devhorizon_day', $day );
	update_post_meta( $post_id, '_devhorizon_start_time', $start_time );
	update_post_meta( $post_id, '_devhorizon_end_time', $end_time );
	update_post_meta( $post_id, '_devhorizon_start_minutes', devhorizon_time_to_minutes( $start_time ) );
	update_post_meta( $post_id, '_devhorizon_location', $location );
	update_post_meta( $post_id, '_devhorizon_highlighted', $highlighted );
}
add_action( 'save_post', 'devhorizon_save_session_meta' );
