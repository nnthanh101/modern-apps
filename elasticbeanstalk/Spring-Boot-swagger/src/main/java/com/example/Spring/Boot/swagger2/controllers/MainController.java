package com.example.Spring.Boot.swagger2.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.Spring.Boot.swagger2.model.PartnerSerexCareerModel;
import com.example.Spring.Boot.swagger2.repositories.PartnerSerexCareerRepository;

@RestController
public class MainController {
	
	@Autowired
    private PartnerSerexCareerRepository careerRepository;
	
	@RequestMapping(value = "/api/posts/getAllPartnerCareer", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> getAllPartnerCareer(){
		try {
			List<PartnerSerexCareerModel> lst = careerRepository.findAll();
			return ResponseEntity.ok().body(lst);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@RequestMapping(value = "/api/posts/getAllPartnerCareerByParcode", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> getAllPartnerCareerByParcode(@Param(value = "parcode") String parcode){
		try {
			List<PartnerSerexCareerModel> lst = careerRepository.findByParcode(parcode);
			return ResponseEntity.ok().body(lst);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
