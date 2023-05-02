package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParameterValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParameterValue.class);
        ParameterValue parameterValue1 = new ParameterValue();
        parameterValue1.setId(1L);
        ParameterValue parameterValue2 = new ParameterValue();
        parameterValue2.setId(parameterValue1.getId());
        assertThat(parameterValue1).isEqualTo(parameterValue2);
        parameterValue2.setId(2L);
        assertThat(parameterValue1).isNotEqualTo(parameterValue2);
        parameterValue1.setId(null);
        assertThat(parameterValue1).isNotEqualTo(parameterValue2);
    }
}
