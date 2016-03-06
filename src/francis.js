(function() {

	var francis = angular.module( 'Francis', [] );

	function setHandler( $xhr, $q, $dataType ) {
		return $q( function( $resolve, $reject ) {
			$xhr.onreadystatechange = function() {
				if( $xhr.readyState === 4 ) {
					if( $xhr.status === 200 ) {
						var result = $xhr.responseText;

						if( $dataType == 'json' ) {
							result = JSON.parse( result );
							$resolve( result );
						}
						else {
							$resolve( result );
						}
					}
					else {
						$reject( $xhr );
					}
				}
			};
		} );
	}

	function getXHR() {
		var xhr;

		if( window.XMLHttpRequest ) { // Mozilla, Safari, ...
			xhr = new XMLHttpRequest();
		}
		else if( window.ActiveXObject ) { // IE
			try {
				xhr = new ActiveXObject( 'Msxml2.XMLHTTP' );
			}
			catch( error ) {
				try {
					xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
				}
				catch( error ) {
				}
			}
		}

		return xhr;
	}

	function ajax( $url, $params, $callback ) {
		if( angular.isString( $url ) ) {
			if( angular.isFunction( $params ) ) {
				$callback = $params;
			}
			if( !angular.isObject( $params ) ) {
				$params = {};
			}
			$params.url = $url;
		}
		else if( angular.isObject( $url ) ) {
			if( angular.isFunction( $params ) ) {
				$callback = $params;
			}
			$params = $url;
		}
		else {
			throw new Error( 'URL or Parameters Object required.' );
			return false;
		}

		var url = $params.url;
		var type = $params.type || 'GET';
		type = type.toUpperCase();
		var dataType = $params.dataType || 'json';
		dataType.toUpperCase();
		var async = $params.async === undefined ? true : $params.async;
		var contentType = $params.contentType || 'application/x-www-form-urlencoded; charset=UTF-8';
		var context = $params.context || this;
		var data = $params.data || {};
		var headers = $params.headers || {};
		var withCredentials = $params.withCredentials === undefined ? false : $params.withCredentials;

		var query = '';
		var key;
		for( key in data ) {
			query += '&';
			query += key;
			query += '=';
			query += data[ key ];
		}
		if( query ) {
			query = query.substr( 1 );
		}

		var xhr = getXHR();
		var q = setHandler( xhr, this.$q, dataType );
		q.then( function( $data ) {
			$callback.apply( context, [ $data ] );
		} );

		if( "withCredentials" in xhr ) {
			xhr.open( type, url, async );
			xhr.withCredentials = withCredentials;
		}
		else if( typeof XDomainRequest != "undefined" ) {
			xhr = new XDomainRequest();
			xhr.open( type, url, async );
		}
		else {
			xhr = null;
		}

		if (!xhr) {
			throw new Error( 'CORS not supported' );
		}

		xhr.setRequestHeader( 'Content-type', contentType );
		for( key in headers ) {
			xhr.setRequestHeader( key, headers[ key ] );
		}
		xhr.send( query );

		return this;
	}

	function initialize( $q ) {
		var object = {};
		object.$q = $q;
		object.ajax = ajax;
		object.NAME = 'My name is AJAX!!!';
		object.VERSION = '0.0.1';

		return object;
	}

	function generate() {
		this.$get = [ '$q', initialize ];
	}

	francis.provider( 'Francis', generate );

})();