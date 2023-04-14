package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ActionParametersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActionParameters.class);
        ActionParameters actionParameters1 = new ActionParameters();
        actionParameters1.setId(1L);
        ActionParameters actionParameters2 = new ActionParameters();
        actionParameters2.setId(actionParameters1.getId());
        assertThat(actionParameters1).isEqualTo(actionParameters2);
        actionParameters2.setId(2L);
        assertThat(actionParameters1).isNotEqualTo(actionParameters2);
        actionParameters1.setId(null);
        assertThat(actionParameters1).isNotEqualTo(actionParameters2);
    }
}
