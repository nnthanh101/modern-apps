package io.job4u.starter.version;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
public class VersionController {
    @RequestMapping("/springboot")
    public String index() {
        InetAddress ip = null;
        String hostname;
        try {
            ip = InetAddress.getLocalHost();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        hostname = ip.getHostName();
        return "Container Info :" + hostname + " OS Architecture : " + System.getProperty("os.arch") + " Java Version : " + System.getProperty("java.version");
    }
}