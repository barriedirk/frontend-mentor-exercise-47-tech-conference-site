<?php
/**
 * DevHorizon content importer.
 *
 * @package Tech_Conference_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the import page under Tools.
 */
function devhorizon_register_import_page() {
	add_management_page(
		__( 'Import DevHorizon', 'tech-conference-site' ),
		__( 'Import DevHorizon', 'tech-conference-site' ),
		'manage_options',
		'devhorizon-import',
		'devhorizon_render_import_page'
	);
}
add_action( 'admin_menu', 'devhorizon_register_import_page' );

/**
 * Processes the import form.
 */
function devhorizon_maybe_run_import() {
	if ( ! is_admin() || ! isset( $_POST['devhorizon_import_submit'] ) ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to run this import.', 'tech-conference-site' ) );
	}

	check_admin_referer( 'devhorizon_import_action', 'devhorizon_import_nonce' );

	$result = devhorizon_run_import();

	if ( is_wp_error( $result ) ) {
		$notice = array(
			'type'    => 'error',
			'message' => $result->get_error_message(),
		);
	} else {
		$notice = array(
			'type'    => 'success',
			'message' => sprintf(
				/* translators: 1: tracks, 2: speakers, 3: sessions, 4: photos. */
				__( 'Import complete: %1$d tracks, %2$d speakers, %3$d sessions, and %4$d photos processed.', 'tech-conference-site' ),
				(int) $result['tracks'],
				(int) $result['speakers'],
				(int) $result['sessions'],
				(int) $result['photos']
			),
		);
	}

	set_transient( 'devhorizon_import_notice_' . get_current_user_id(), $notice, 60 );

	wp_safe_redirect( admin_url( 'tools.php?page=devhorizon-import' ) );
	exit;
}
add_action( 'admin_init', 'devhorizon_maybe_run_import' );

/**
 * Notice shown when content has not been imported yet.
 */
function devhorizon_import_admin_notice() {
	if ( get_option( 'devhorizon_imported_at' ) || ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$screen = get_current_screen();

	if ( ! $screen || ! in_array( $screen->id, array( 'dashboard', 'tools_page_devhorizon-import' ), true ) ) {
		return;
	}

	printf(
		'<div class="notice notice-warning"><p>%1$s <a href="%2$s">%3$s</a></p></div>',
		esc_html__( 'DevHorizon content has not been imported yet.', 'tech-conference-site' ),
		esc_url( admin_url( 'tools.php?page=devhorizon-import' ) ),
		esc_html__( 'Run the importer', 'tech-conference-site' )
	);
}
add_action( 'admin_notices', 'devhorizon_import_admin_notice' );

/**
 * Renders the import page.
 */
function devhorizon_render_import_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$notice_key = 'devhorizon_import_notice_' . get_current_user_id();
	$notice     = get_transient( $notice_key );

	if ( $notice ) {
		delete_transient( $notice_key );
	}

	$imported_at = get_option( 'devhorizon_imported_at' );
	$counts      = get_option( 'devhorizon_import_counts', array() );
	$json_path   = DEVHORIZON_DIR . '/data/devhorizon-data.json';
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Import DevHorizon', 'tech-conference-site' ); ?></h1>

		<?php if ( $notice ) : ?>
			<div class="notice notice-<?php echo esc_attr( $notice['type'] ); ?> is-dismissible">
				<p><?php echo esc_html( $notice['message'] ); ?></p>
			</div>
		<?php endif; ?>

		<p>
			<?php esc_html_e( 'This process creates the tracks, the 20 speakers with their photos, and the 20 event sessions from the data file included in the theme. It is idempotent: running it again updates existing content instead of duplicating it.', 'tech-conference-site' ); ?>
		</p>

		<p>
			<strong><?php esc_html_e( 'Data file:', 'tech-conference-site' ); ?></strong>
			<code><?php echo esc_html( $json_path ); ?></code>
		</p>

		<?php if ( $imported_at ) : ?>
			<div class="notice notice-info inline">
				<p>
					<?php
					printf(
						/* translators: 1: date, 2: tracks, 3: speakers, 4: sessions, 5: photos. */
						esc_html__( 'Last import: %1$s. Tracks: %2$d · Speakers: %3$d · Sessions: %4$d · Photos: %5$d.', 'tech-conference-site' ),
						esc_html( $imported_at ),
						(int) ( $counts['tracks'] ?? 0 ),
						(int) ( $counts['speakers'] ?? 0 ),
						(int) ( $counts['sessions'] ?? 0 ),
						(int) ( $counts['photos'] ?? 0 )
					);
					?>
				</p>
			</div>
		<?php endif; ?>

		<form method="post">
			<?php wp_nonce_field( 'devhorizon_import_action', 'devhorizon_import_nonce' ); ?>
			<?php submit_button( __( 'Import DevHorizon content', 'tech-conference-site' ), 'primary', 'devhorizon_import_submit' ); ?>
		</form>

		<h2><?php esc_html_e( 'After importing', 'tech-conference-site' ); ?></h2>
		<ol>
			<li><?php esc_html_e( 'Create the Home, Speakers, and Schedule pages and assign the corresponding templates.', 'tech-conference-site' ); ?></li>
			<li><?php esc_html_e( 'Set the Home page as the static front page under Settings → Reading.', 'tech-conference-site' ); ?></li>
			<li><?php esc_html_e( 'Create a menu under Appearance → Menus and assign it to the "Primary Menu" location.', 'tech-conference-site' ); ?></li>
		</ol>
	</div>
	<?php
}

/**
 * Runs the full import.
 *
 * @return array|WP_Error
 */
function devhorizon_run_import() {
	$json_path = DEVHORIZON_DIR . '/data/devhorizon-data.json';

	if ( ! file_exists( $json_path ) ) {
		return new WP_Error(
			'devhorizon_missing_data',
			__( 'The file data/devhorizon-data.json could not be found.', 'tech-conference-site' )
		);
	}

	$json = file_get_contents( $json_path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

	if ( false === $json ) {
		return new WP_Error(
			'devhorizon_unreadable_data',
			__( 'The data file could not be read.', 'tech-conference-site' )
		);
	}

	$data = json_decode( $json, true );

	if ( ! is_array( $data ) || empty( $data['speakers'] ) || empty( $data['talks'] ) ) {
		return new WP_Error(
			'devhorizon_invalid_data',
			__( 'The data file does not have the expected format.', 'tech-conference-site' )
		);
	}

	$counts = array(
		'tracks'   => 0,
		'speakers' => 0,
		'sessions' => 0,
		'photos'   => 0,
	);

	$track_map   = array();
	$speaker_map = array();
	$errors      = array();

	// Tracks.
	foreach ( (array) $data['tracks'] as $index => $track ) {
		$slug = sanitize_title( $track['name'] );
		$term = term_exists( $slug, 'devhorizon_track' );

		if ( $term ) {
			$term_id = (int) ( is_array( $term ) ? $term['term_id'] : $term );
			$updated = wp_update_term(
				$term_id,
				'devhorizon_track',
				array(
					'name'        => $track['name'],
					'description' => $track['description'],
				)
			);

			if ( is_wp_error( $updated ) ) {
				$errors[] = $updated->get_error_message();
				continue;
			}
		} else {
			$created = wp_insert_term(
				$track['name'],
				'devhorizon_track',
				array(
					'slug'        => $slug,
					'description' => $track['description'],
				)
			);

			if ( is_wp_error( $created ) ) {
				$errors[] = $created->get_error_message();
				continue;
			}

			$term_id = (int) $created['term_id'];
		}

		update_term_meta( $term_id, '_devhorizon_order', (int) $index );
		update_term_meta( $term_id, '_devhorizon_color', $track['color'] );
		update_term_meta( $term_id, '_devhorizon_source_id', $track['id'] );

		$track_map[ $track['id'] ] = $term_id;
		++$counts['tracks'];
	}

	// Speakers.
	foreach ( (array) $data['speakers'] as $index => $speaker ) {
		$source_id = $speaker['id'];
		$post_id   = devhorizon_find_imported_post( 'devhorizon_speaker', $source_id );
		$post_data = array(
			'post_type'    => 'devhorizon_speaker',
			'post_status'  => 'publish',
			'post_title'   => $speaker['name'],
			'post_content' => $speaker['bio'] ?? '',
			'post_name'    => sanitize_title( $speaker['name'] ),
			'menu_order'   => (int) $index,
		);

		if ( $post_id ) {
			$post_data['ID'] = $post_id;
			$saved_id        = wp_update_post( $post_data, true );
		} else {
			$saved_id = wp_insert_post( $post_data, true );
		}

		if ( is_wp_error( $saved_id ) ) {
			$errors[] = $saved_id->get_error_message();
			continue;
		}

		$post_id = (int) $saved_id;

		update_post_meta( $post_id, '_devhorizon_source_id', $source_id );
		update_post_meta( $post_id, '_devhorizon_role', $speaker['role'] ?? '' );
		update_post_meta( $post_id, '_devhorizon_company', $speaker['company'] ?? '' );
		update_post_meta( $post_id, '_devhorizon_featured', ! empty( $speaker['featured'] ) ? 1 : 0 );

		$avatar_file = basename( (string) ( $speaker['avatar'] ?? '' ) );
		$attachment  = devhorizon_import_attachment( $avatar_file, $speaker['name'] );

		if ( $attachment ) {
			set_post_thumbnail( $post_id, $attachment );
			++$counts['photos'];
		}

		$speaker_map[ $source_id ] = $post_id;
		++$counts['speakers'];
	}

	// Sessions.
	foreach ( (array) $data['talks'] as $index => $talk ) {
		$source_id = $talk['id'];
		$post_id   = devhorizon_find_imported_post( 'devhorizon_session', $source_id );
		$post_data = array(
			'post_type'    => 'devhorizon_session',
			'post_status'  => 'publish',
			'post_title'   => $talk['title'],
			'post_content' => $talk['description'] ?? '',
			'post_name'    => sanitize_title( $talk['title'] ),
			'menu_order'   => (int) $index,
		);

		if ( $post_id ) {
			$post_data['ID'] = $post_id;
			$saved_id        = wp_update_post( $post_data, true );
		} else {
			$saved_id = wp_insert_post( $post_data, true );
		}

		if ( is_wp_error( $saved_id ) ) {
			$errors[] = $saved_id->get_error_message();
			continue;
		}

		$post_id    = (int) $saved_id;
		$speaker_id = isset( $speaker_map[ $talk['speakerId'] ] ) ? (int) $speaker_map[ $talk['speakerId'] ] : 0;
		$term_id    = isset( $track_map[ $talk['trackId'] ] ) ? (int) $track_map[ $talk['trackId'] ] : 0;

		update_post_meta( $post_id, '_devhorizon_source_id', $source_id );
		update_post_meta( $post_id, '_devhorizon_speaker_id', $speaker_id );
		update_post_meta( $post_id, '_devhorizon_day', (int) $talk['day'] );
		update_post_meta( $post_id, '_devhorizon_start_time', $talk['startTime'] );
		update_post_meta( $post_id, '_devhorizon_end_time', $talk['endTime'] );
		update_post_meta( $post_id, '_devhorizon_start_minutes', devhorizon_time_to_minutes( $talk['startTime'] ) );
		update_post_meta( $post_id, '_devhorizon_location', $talk['location'] );
		update_post_meta( $post_id, '_devhorizon_highlighted', ! empty( $talk['highlighted'] ) ? 1 : 0 );

		if ( $term_id ) {
			wp_set_object_terms( $post_id, array( $term_id ), 'devhorizon_track', false );
		}

		++$counts['sessions'];
	}

	update_option( 'devhorizon_imported_at', current_time( 'mysql' ) );
	update_option( 'devhorizon_import_counts', $counts );

	if ( ! empty( $errors ) ) {
		update_option( 'devhorizon_import_last_errors', array_slice( array_unique( $errors ), 0, 10 ) );
	} else {
		delete_option( 'devhorizon_import_last_errors' );
	}

	return $counts;
}

/**
 * Finds an imported post by its source ID.
 *
 * @param string $post_type Post type.
 * @param string $source_id JSON ID.
 * @return int
 */
function devhorizon_find_imported_post( $post_type, $source_id ) {
	$posts = get_posts(
		array(
			'post_type'      => $post_type,
			'post_status'    => 'any',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_devhorizon_source_id',
			'meta_value'     => $source_id,
		)
	);

	return $posts ? (int) $posts[0] : 0;
}

/**
 * Imports a local theme image into the Media Library.
 *
 * @param string $filename File name.
 * @param string $title    Attachment title.
 * @return int Attachment ID, or 0 on failure.
 */
function devhorizon_import_attachment( $filename, $title ) {
	$filename = sanitize_file_name( basename( (string) $filename ) );

	if ( ! $filename ) {
		return 0;
	}

	$source = DEVHORIZON_DIR . '/images/' . $filename;

	if ( ! file_exists( $source ) ) {
		return 0;
	}

	$existing = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_devhorizon_source_file',
			'meta_value'     => $filename,
		)
	);

	if ( $existing ) {
		return (int) $existing[0];
	}

	$contents = file_get_contents( $source ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents

	if ( false === $contents ) {
		return 0;
	}

	$upload = wp_upload_bits( $filename, null, $contents );

	if ( ! empty( $upload['error'] ) ) {
		return 0;
	}

	$filetype = wp_check_filetype( $upload['file'] );

	$attachment_id = wp_insert_attachment(
		array(
			'post_mime_type' => $filetype['type'],
			'post_title'     => sanitize_text_field( $title ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		),
		$upload['file'],
		true
	);

	if ( is_wp_error( $attachment_id ) || ! $attachment_id ) {
		return 0;
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';

	$metadata = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
	wp_update_attachment_metadata( $attachment_id, $metadata );

	update_post_meta( $attachment_id, '_devhorizon_source_file', $filename );
	update_post_meta( $attachment_id, '_wp_attachment_image_alt', sanitize_text_field( $title ) );

	return (int) $attachment_id;
}
