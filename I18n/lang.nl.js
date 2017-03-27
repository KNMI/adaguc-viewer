
var I18n = {
	delete: { text: 'Verwijder' },
	delete_selected_flag_tooltip: { tooltip: 'Verwijder geselecteerde vlag' },
	add_flag_tooltip: { tooltip: 'Voeg een vlag toe met de huidige latitude, longitude en naam' },
	are_you_sure: { text: 'Weet je zeker dat je deze vlag wil verwijderen?' },
	delete_title_confirm: { text: 'Verwijder vlag' },
	default_selected_flag: { text: 'Geen'},
	selected_flag: { text: 'Meest dichtbije vlag:' },
	add_point_interest_abstract: { text: 'Update of voeg je interessepunt toe met een latitude, een longitude en een naam naar keuze.' },
	insert_name: { text: 'Naam:' },
	add_point_interest: { text: 'Voeg interessepunt toe'},
	add: { text: 'Toevoegen' },
	place_search_term: { text: 'Zoeken naar locatie&hellip;' },
	debug_searching_location: { text: 'Zoeken naar locatie in SQLite DB:' },
	debug_searching_sqlite_location: { text: 'Zoeken naar locatie met GeoNames API:' },
	geonames_api_call_failed: { text: 'GeoNames API request mislukt' },
	geonames_sqlite_call_failed: { text: 'GeoNames SQLite request mislukt.' },
	no_results_search: { text: 'Geen resultaten voor zoekopdracht' },
	unable_to_do_getcapabilities: { text: 'Kan geen GetCapabilities uitvoeren voor' },
	unable_to_connect_server: { text: 'Kan geen verbinding maken met de service.' },
	unable_to_search: { text: 'Kan geen zoekopdracht doen' },
	no_urls_in_config: { text: 'Geen URL\'s beschreven in configuratiebestand' },
	only_alpha_num_allowed: { text: 'Zoekterm mag alleen alpha numerieke karakters bevatten' },
	no_search_definition: { text: 'Geen zoekterm ingevuld' },
	result: { text: 'Resultaat' },
	service_has_error: { text: '--- Service geeft een error ---' },
	no_time_dimension_in_layer: { text: 'Geen tijd dimensie gevonden in deze laag' },
	no_service_defined: { text: 'Geen service gedefiniëerd'},
	service_url_empty: { text: 'Service URL is leeg'},
	wms_service_exception_code: { text: 'WMS Service exception met code ' },
	unnamed_service: { text: 'Niet-benoemde dienst' },
	add_layers: { text: 'Voeg lagen toe&hellip;', tooltip: 'Voeg nieuwe lagen, datasets en diensten toe' },
	add_custom_service: { text: 'Voeg een handmatige versie 1.1.1 Web Map Service (WMS) toe' },
	properties_for: { text: 'Eigenschappen voor' },
	color_range: { text: 'Kleurbereik' },
	reset: { text: 'Reset' },
	apply: { text: 'Toepassen' },
	min_value: { text: 'Min waarde' },
	max_value: { text: 'Max waarde' },
	wms_version: { text: 'WMS versie' },
	wms_comp_mode: { text: 'WMS 1.3.0 BBOX compatibiliteitsmodus' },
	projections: { text: 'Projecties' },
	projection: { text: 'Projectie' },
	epsg_code: { text: 'EPSG Code' },
	bounding_box: { text: 'Selectiekader' },
	file_metadata: { text: 'Bestand metadata' },
	show_file_metadata: { text: 'Toon bestand metadata' },
	download_data_wcs: { text: 'Download data via WCS' },
	coordinate_reference_system: { text: 'Coordinatie referentiesysteem' },
	area_bounding_box: { text: 'Gebied / Selectiekader' },
	dimensions: { text: 'Dimensies' },
        dimension: { text: 'Dimensie' },
	formats: { text: 'Formaten' },
	north: { text: 'Noord'},
	west: { text: 'West'},
	east: { text: 'Oost'},
	south: { text: 'Zuid' },
	cell_size: { text: 'Cel grootte' },
	x_resolution: { text: 'X Resolutie' },
	y_resolution: { text: 'Y Resolutie' },
	raster_size: { text: 'Rastergrootte'},
	raster_width: { text: 'Rasterbreedte'},
	raster_height: { text: 'Rasterhoogte'},
	format: { text: 'Formaat' },
	show: { text: 'Toon' },
	create_permanent_links: { text: 'Creëer permanente links' },
	please_select_product: { text: 'Selecteer een product' },
	no_capability_element_found: { text: 'Geen Capability element fgevonden in service' },
	no_wms_capability_element_found: { text: 'Geen WMS Capability element gevonden' },
	no_wms_layer_element_found: { text: 'Geen WMS Layer element gevonden' },
	settings_and_options: { tooltip: 'Instellingen en opties' },
	show_time_selection_window: { text: 'Selecteer periode&hellip;' },
	create_animation: { text: 'Creëer animatie' },
	create_link: { text: 'Creëer link&hellip;' },
	show_debug_information: { text: 'Toon debug informatie&hellip;' },
	add_custom_wms_service: { text: 'Voeg aangepaste WMS service toe&hellip;' },
	undo_zoom_pan_action: { text: 'Ongedaan maken zoom actie' },
	redo_zoom_pan_action: { text: 'Opnieuw doen zoom actie' },
	abort_loading: { text: 'Laden afbreken' },
	about_the_adaguc_viewer: { text: 'Over de ADAGUC viewer', tooptip: 'Toon informatie over de ADAGUC viewer' },
	about_adaguc: { text: 'Over ADAGUC' },
	about_adaguc_more_information: { text: '<br/><br/>Ga naar <a target=\"_blank\" href=\"http://adaguc.knmi.nl/\">http://adaguc.knmi.nl/</a> voor meer informatie.<div>' },
	layers: { text: 'Lagen', tooltip: 'Lagen' },
	predefined_areas: { tooltip: 'Selecteer voorgedefiniëerde gebieden' },
	basemaps_overlays: { tooltip: 'Selecteer basiskaarten en overlappingen' },
	add_layers_and_services: { text: 'Lagen en diensten toevoegen' },
	add_new_layer: { tooltip: 'Nieuwe laag toevoegen' },
	clone_this_layer: { tooltip: 'Dupliceer deze laag en plaats het bovenop de lijst met lagen' },
	remove_this_layer: { tooltip: 'Verwijder deze laag' },
	move_layer_up: { tooltip: 'Verplaats deze laag omhoog in de lijst en op de kaart' },
	move_layer_down: { tooltip: 'Verplaats deze laag omlaag in de lijst en op de kaart' },
	title: { text: 'Titel' },
	layer: { text: 'Laag' },
	type: { text: 'Type' },
	name: { text: 'Naam'},
        abstract: { text: 'Abstract'},
        service: { text: 'Service'},
	description: { text: 'Beschrijving'},
	no_dimensions_available: { text: 'Geen lagen met een tijd dimensie beschikbaar.' },
	load_all: { text: 'Laad alles' },
	play_animation: { text: 'Speel af' },
	stop: { text: 'Stop' },
	start: { text: 'Start' },
	opacity: { text: 'Opacity:' },
	zoom_to_this_layer: { tooltip: 'Inzoomen op deze laag' },
	start_or_stop_animation: { tooltip: 'Start of stop animatie' },
	reload_this_layer: { tooltip: 'Herlaad deze laag' },
	layer_properties: { tooltip: 'Laag eigenschappen' },
	hide_or_display_layer: { tooltip: 'Verberg of toon deze laag' },
	select_layer_product_from_service: { tooltip: 'Selecteer een laag of product van de service.' },
	change_style_layer: { tooltip: 'Verander de stijl van deze laag' },
	available_styles: { text: 'Beschikbare stijlen' },
	no_styles_available: { text: 'Geen stijlen beschikbaar' },
	default: { text: 'Standaard' },
	embed: { text: 'Embed' },
	time_selection: { text: 'Tijd selectie' },
	local_time: { text: 'Lokale tijd' },
	year: { text: 'Jaar' },
	month: { text: 'Maand' },
	day: { text: 'Dag' },
	hour: { text: 'Uur' },
	min: { text: 'Min' },
	select_layer: { text: 'Selecteer laag' },
	select_dimension: { text: 'Selecteer dimensie' },
	start_at: { text: 'Begin bij' },
	number_of_steps: { text: 'Aantal stappen' },
	delay_ms: { text: 'Vertraging (ms)' },
	enter_wms_version_url: { text: 'Voeg WMS versie 1.1.1 URL hier toe...' },
	enter_search_term: { text: 'Vul uw lokatie in&hellip;' },
        not_available_message: { text: 'Niet beschikbaar' }
};