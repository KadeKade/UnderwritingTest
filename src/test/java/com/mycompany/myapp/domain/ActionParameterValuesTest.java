package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActionParameterValuesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActionParameterValues.class);
        ActionParameterValues actionParameterValues1 = new ActionParameterValues();
        actionParameterValues1.setId(1L);
        ActionParameterValues actionParameterValues2 = new ActionParameterValues();
        actionParameterValues2.setId(actionParameterValues1.getId());
        assertThat(actionParameterValues1).isEqualTo(actionParameterValues2);
        actionParameterValues2.setId(2L);
        assertThat(actionParameterValues1).isNotEqualTo(actionParameterValues2);
        actionParameterValues1.setId(null);
        assertThat(actionParameterValues1).isNotEqualTo(actionParameterValues2);
    }
}
