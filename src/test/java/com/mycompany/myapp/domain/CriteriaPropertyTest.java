package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CriteriaPropertyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CriteriaProperty.class);
        CriteriaProperty criteriaProperty1 = new CriteriaProperty();
        criteriaProperty1.setId(1L);
        CriteriaProperty criteriaProperty2 = new CriteriaProperty();
        criteriaProperty2.setId(criteriaProperty1.getId());
        assertThat(criteriaProperty1).isEqualTo(criteriaProperty2);
        criteriaProperty2.setId(2L);
        assertThat(criteriaProperty1).isNotEqualTo(criteriaProperty2);
        criteriaProperty1.setId(null);
        assertThat(criteriaProperty1).isNotEqualTo(criteriaProperty2);
    }
}
