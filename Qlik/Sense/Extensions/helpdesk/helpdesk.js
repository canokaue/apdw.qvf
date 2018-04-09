/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );

	//callbacks -- inserted here --
	//open apps -- inserted here --
	var app = qlik.openApp( 'Helpdesk Management.qvf', config );

	//get objects -- inserted here --
	app.getObject( 'QV06', 'uETyGUP' );
	app.getObject( 'QV04', 'xfvKMP' );
	app.getObject( 'QV05', 'rJFbvG' );
	app.getObject( 'QV03', 'PAppmU' );
	app.getObject( 'QV02', '298bbd6d-f23d-4469-94a2-df243d680e0c' );
	app.getObject( 'QV01', 'hRZaKk' );
	//create cubes and lists -- inserted here --

} );
