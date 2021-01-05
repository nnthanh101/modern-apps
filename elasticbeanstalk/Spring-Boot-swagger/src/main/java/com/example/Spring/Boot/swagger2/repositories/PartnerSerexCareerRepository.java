package com.example.Spring.Boot.swagger2.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.Spring.Boot.swagger2.model.PartnerSerexCareerModel;

public interface PartnerSerexCareerRepository extends CrudRepository<PartnerSerexCareerModel, Long> {
	List<PartnerSerexCareerModel> findAll();
	List<PartnerSerexCareerModel> findByParcode(String parcode);
}
