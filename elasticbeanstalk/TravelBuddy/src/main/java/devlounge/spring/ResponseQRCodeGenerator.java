package devlounge.spring;

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

import net.glxn.qrgen.javase.QRCode;
import net.glxn.qrgen.core.image.ImageType;

@Controller
public class ResponseQRCodeGenerator {

	@ResponseBody
	@RequestMapping(value = "/qrcodegen/{size}/{text}", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
	public void QRCodeGenerator(@PathVariable("size") int size, @PathVariable("text") String text, HttpServletResponse response)
	{
	    System.out.println("ResponseQRCodeGenerator called");
		Subsegment subsegment = AWSXRay.beginSubsegment(this.getClass().getName());
		Segment segment = AWSXRay.getCurrentSegment();
		
		try {
			
			int qrSize = size;		
			segment.putAnnotation("qrSize", qrSize);

			response.setHeader("Cache-Control", "no-store");
		    response.setHeader("Pragma", "no-cache");
		    response.setDateHeader("Expires", 0);
		    response.setContentType("image/png");
		    ServletOutputStream responseOutputStream = response.getOutputStream();
		    QRCode.from(text).to(ImageType.PNG).withSize(qrSize, qrSize).writeTo(responseOutputStream);
		    responseOutputStream.flush();
		    responseOutputStream.close();

		    subsegment.end();
		    
		} catch (Exception ex) {
			System.out.println("EXCEPTION::" + ex.getMessage());
		}
		finally {
			AWSXRay.endSubsegment();
		}
	}
}
