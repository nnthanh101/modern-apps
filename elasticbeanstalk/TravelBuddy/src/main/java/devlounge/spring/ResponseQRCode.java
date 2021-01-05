package devlounge.spring;

import java.util.Base64;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.amazonaws.xray.AWSXRay;
import com.amazonaws.xray.entities.Segment;
import com.amazonaws.xray.entities.Subsegment;

@Controller
public class ResponseQRCode {

	@ResponseBody
	@RequestMapping(value = "/qrcode/{size}/{text}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public void QRCodeGenerator(@PathVariable("size") int size, @PathVariable("text") String text, HttpServletResponse response)
	{
	    System.out.println("QRCodeGenerator called");
		Subsegment subsegment = AWSXRay.beginSubsegment(this.getClass().getName());
		Segment segment = AWSXRay.getCurrentSegment();
		
		String textToEncode = text;
		int qrSize = size;		
		segment.putAnnotation("qrSize", qrSize);
			
		String qrCode = "";
		try {
			qrCode = Utilities.getQRCode(textToEncode, qrSize);
			
			response.setHeader("Cache-Control", "no-store");
		    response.setHeader("Pragma", "no-cache");
		    response.setDateHeader("Expires", 0);
		    response.setContentType("image/png");
		    ServletOutputStream responseOutputStream = response.getOutputStream();
		    responseOutputStream.write(Base64.getDecoder().decode(qrCode));
		    responseOutputStream.flush();
		    responseOutputStream.close();
		    
		} catch (Exception ex) {
			System.out.println("EXCEPTION::" + ex.getMessage());
		}
		finally {
			AWSXRay.endSubsegment();
		}
	    
	}
}
