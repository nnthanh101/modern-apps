package devlounge.spring;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;

import com.amazonaws.xray.proxies.apache.http.HttpClientBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Utilities {

	
	@SuppressWarnings("unchecked")
	public static String getQRCode(String text, int size) throws IOException {
	    CloseableHttpClient httpclient = HttpClientBuilder.create().build();
	    HttpGet httpGet = new HttpGet("https://p48ilswlx6.execute-api.us-east-1.amazonaws.com/prod/qrcode/" + size + "/" + URLEncoder.encode(text, "UTF-8"));
	    CloseableHttpResponse response = httpclient.execute(httpGet);
	    try {
	      HttpEntity entity = response.getEntity();
	      InputStream inputStream = entity.getContent();
	      ObjectMapper mapper = new ObjectMapper();
	      Map<String, String> jsonMap = mapper.readValue(inputStream, Map.class);
	      String qrcode = jsonMap.get("qrCode");
	      EntityUtils.consume(entity);
	      return qrcode;
	    } finally {
	      response.close();
	    }
	  }	
	
}
