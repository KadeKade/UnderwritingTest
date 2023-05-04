package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ActionParameter.
 */
@Entity
@Table(name = "action_parameter")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ActionParameter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "parameter_key")
    private String parameterKey;

    @Column(name = "parameter_value")
    private String parameterValue;

    @ManyToOne
    @JsonIgnoreProperties(value = { "criteriaParameters", "actionParameters", "criteriaSet" }, allowSetters = true)
    private Criteria criteria;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ActionParameter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getParameterKey() {
        return this.parameterKey;
    }

    public ActionParameter parameterKey(String parameterKey) {
        this.setParameterKey(parameterKey);
        return this;
    }

    public void setParameterKey(String parameterKey) {
        this.parameterKey = parameterKey;
    }

    public String getParameterValue() {
        return this.parameterValue;
    }

    public ActionParameter parameterValue(String parameterValue) {
        this.setParameterValue(parameterValue);
        return this;
    }

    public void setParameterValue(String parameterValue) {
        this.parameterValue = parameterValue;
    }

    public Criteria getCriteria() {
        return this.criteria;
    }

    public void setCriteria(Criteria criteria) {
        this.criteria = criteria;
    }

    public ActionParameter criteria(Criteria criteria) {
        this.setCriteria(criteria);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ActionParameter)) {
            return false;
        }
        return id != null && id.equals(((ActionParameter) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionParameter{" +
            "id=" + getId() +
            ", parameterKey='" + getParameterKey() + "'" +
            ", parameterValue='" + getParameterValue() + "'" +
            "}";
    }
}
