import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParameterValue, NewParameterValue } from '../parameter-value.model';

export type PartialUpdateParameterValue = Partial<IParameterValue> & Pick<IParameterValue, 'id'>;

export type EntityResponseType = HttpResponse<IParameterValue>;
export type EntityArrayResponseType = HttpResponse<IParameterValue[]>;

@Injectable({ providedIn: 'root' })
export class ParameterValueService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parameter-values');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parameterValue: NewParameterValue): Observable<EntityResponseType> {
    return this.http.post<IParameterValue>(this.resourceUrl, parameterValue, { observe: 'response' });
  }

  update(parameterValue: IParameterValue): Observable<EntityResponseType> {
    return this.http.put<IParameterValue>(`${this.resourceUrl}/${this.getParameterValueIdentifier(parameterValue)}`, parameterValue, {
      observe: 'response',
    });
  }

  partialUpdate(parameterValue: PartialUpdateParameterValue): Observable<EntityResponseType> {
    return this.http.patch<IParameterValue>(`${this.resourceUrl}/${this.getParameterValueIdentifier(parameterValue)}`, parameterValue, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParameterValue>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParameterValue[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getParameterValueIdentifier(parameterValue: Pick<IParameterValue, 'id'>): number {
    return parameterValue.id;
  }

  compareParameterValue(o1: Pick<IParameterValue, 'id'> | null, o2: Pick<IParameterValue, 'id'> | null): boolean {
    return o1 && o2 ? this.getParameterValueIdentifier(o1) === this.getParameterValueIdentifier(o2) : o1 === o2;
  }

  addParameterValueToCollectionIfMissing<Type extends Pick<IParameterValue, 'id'>>(
    parameterValueCollection: Type[],
    ...parameterValuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const parameterValues: Type[] = parameterValuesToCheck.filter(isPresent);
    if (parameterValues.length > 0) {
      const parameterValueCollectionIdentifiers = parameterValueCollection.map(
        parameterValueItem => this.getParameterValueIdentifier(parameterValueItem)!
      );
      const parameterValuesToAdd = parameterValues.filter(parameterValueItem => {
        const parameterValueIdentifier = this.getParameterValueIdentifier(parameterValueItem);
        if (parameterValueCollectionIdentifiers.includes(parameterValueIdentifier)) {
          return false;
        }
        parameterValueCollectionIdentifiers.push(parameterValueIdentifier);
        return true;
      });
      return [...parameterValuesToAdd, ...parameterValueCollection];
    }
    return parameterValueCollection;
  }
}
