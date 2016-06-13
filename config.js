module.exports = {
	"port": 5678,
	"targets": [{
		"name": "test",
		"path": "",
		"keeplocal": [],
		"mail": {
			"smtpTransportOptions": {
				"host": "smtp.mandrillapp.com",
				"port": 2525,
				"auth": {
					"user": "update@ischool.com.tw",
					"pass": "GQwQapZdNFGLd0FRXwHLMw"
				}
			},
			"from": "update@ischool.com.tw",
			"to": "marx.zeng@ischool.com.tw"
		},
		"finalCommand": "",
		"writeTag": true,
		"requireVersion": true
	}, {
		"name": "demo",
		"path": "/Users/marx/Sites/__demo_update",
		"keeplocal": ["x-element.html", "y-element.html"],
		"mail": {
			"smtpTransportOptions": {
				"host": "smtp.mandrillapp.com",
				"port": 2525,
				"auth": {
					"user": "update@ischool.com.tw",
					"pass": "GQwQapZdNFGLd0FRXwHLMw"
				}
			},
			"from": "update@ischool.com.tw",
			"to": "marx.zeng@ischool.com.tw"
		},
		"finalCommand": "",
		"writeTag": true,
		"requireVersion": true
	}]
}
